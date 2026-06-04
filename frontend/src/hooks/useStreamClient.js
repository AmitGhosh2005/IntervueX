import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import {
  initializeStreamClient,
  disconnectStreamClient,
} from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(
  session,
  loadingSession,
  isHost,
  isParticipant
) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] =
    useState(true);

  // Prevent multiple initializations
  const initializedRef = useRef(false);

  useEffect(() => {
     console.log("STREAM EFFECT EXECUTED");
    console.log({
    callId: session?.callId,
    status: session?.status,
    host: session?.host?.clerkId,
    participant: session?.participant?.clerkId,
  });
    let mounted = true;

    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
          console.log(
          "STREAM INIT STARTED",
          session?.callId
        );
      try {
        // Session not loaded yet
        if (!session?.callId) return;

        // User is not part of session
        if (!isHost && !isParticipant) return;

        // Session already ended
        if (session.status === "completed") return;

        // Already initialized
        if (initializedRef.current) return;

        initializedRef.current = true;

        console.log(
          "Initializing Stream Call:",
          session.callId
        );

        const {
          token,
          userId,
          userName,
          userImage,
        } = await sessionApi.getStreamToken();

        if (!mounted) return;

        // VIDEO CLIENT
        const client =
          await initializeStreamClient(
            {
              id: userId,
              name: userName,
              image: userImage,
            },
            token
          );

        if (!mounted) return;

        setStreamClient(client);

        // VIDEO CALL
        videoCall = client.call(
          "default",
          session.callId
        );

        await videoCall.join({
          create: true,
        });

        if (!mounted) return;

        setCall(videoCall);

        // CHAT CLIENT
        const apiKey =
          import.meta.env.VITE_STREAM_API_KEY;

        chatClientInstance =
          StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (!mounted) return;

        setChatClient(chatClientInstance);

        // CHAT CHANNEL
        const chatChannel =
          chatClientInstance.channel(
            "messaging",
            session.callId
          );

        await chatChannel.watch();

        if (!mounted) return;

        setChannel(chatChannel);

        console.log(
          "Stream initialized successfully"
        );
      } catch (error) {
        console.error(
          "STREAM INITIALIZATION ERROR:",
          error
        );

        toast.error(
          error?.message ||
            "Failed to connect to video call"
        );

        initializedRef.current = false;
      } finally {
        if (mounted) {
          setIsInitializingCall(false);
        }
      }
    };

    if (
      session?.callId &&
      !loadingSession &&
      (isHost || isParticipant)
    ) {
      initCall();
    }

 return () => {
      // iife
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, loadingSession, isHost, isParticipant]);


  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;