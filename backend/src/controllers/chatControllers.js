import { chatClient } from "../lib/stream.js";

export async function getStreamtoken(req,res){
    try {
        const token = chatClient.createToken(req.user.clerkId);

        res.setaus(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image,
        })
    } catch (error) {
        console.log("Error in getStreamtoken controller", error.message);
        res.status(500).json({message: "Internal server Error"});
    }
}