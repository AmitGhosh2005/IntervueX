import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req,res) {
    try {
        const { problem, difficulty} = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if(!problem || !difficulty){
            return res.status(400).json({message: "problem and difficulty are required"});
        }

        //generate a unique call id for stream video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        //create session in db
        const session = await Session.create({
            problem,
            difficulty,
            host: userId,
            callId,
        });
        console.log("USER ID:", userId);
        console.log("CLERK ID:", clerkId);
        console.log("PROBLEM:", problem);

        //create stream video call
        await streamClient.video.call("default",callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: {problem,difficulty,sessionId:session._id.toString()},
            },
        });

        //chat messageing
        const channel = chatClient.channel("messaging",callId, {
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId]
        })
        await channel.create();
        res.status(201).json({session});
    } catch (error) {
        console.log("FULL CREATE SESSION ERROR:");
        console.log(error);
        console.log(error.message);
        console.log(error.stack);
        res.status(500).json({message: "Internal server error"});
    }
    
}

export async function getActiveSession(req,res) {
    try {
        const sessions = await Session.find({status: "active"})
        .populate("host", "name profileImage email, clerkId")
        .populate("participant", "name profileImage email, clerkId")
        .sort({createdAt: -1}).limit(20);
        res.status(200).json({sessions})
    } catch (error) {
        console.log("Error in getActiveSession controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function getMyRecentSession(req,res) {
    try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

export async function getSessionById(req,res) {
    try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

export async function joinSession(req,res) {
    try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log("ENDING SESSION:", id);

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // only host can end session
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only host can end session",
      });
    }

    // already completed
    if (session.status === "completed") {
      return res.status(400).json({
        message: "Session already completed",
      });
    }

    // delete video call safely
    try {
      const call = streamClient.video.call(
        "default",
        session.callId
      );

      await call.delete({ hard: true });

      console.log("Call deleted");
    } catch (err) {
      console.log("Call delete failed:", err.message);
    }

    // delete chat channel safely
    try {
      const channel = chatClient.channel(
        "messaging",
        session.callId
      );

      await channel.delete();

      console.log("Channel deleted");
    } catch (err) {
      console.log("Channel delete failed:", err.message);
    }

    session.status = "completed";

    await session.save();

    res.status(200).json({
      message: "Session ended successfully",
      session,
    });

  } catch (error) {
    console.log(
      "Error in endSession controller:",
      error
    );

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
