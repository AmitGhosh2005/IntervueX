import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationKey: ["createSession"],

    mutationFn: sessionApi.createSession,

    onSuccess: () => {
      // refresh sessions after creating
      queryClient.invalidateQueries({
        queryKey: ["activeSessions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myRecentSessions"],
      });

      toast.success("Session created successfully!");
    },

    onError: (error) => {
      console.log("CREATE SESSION ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create room"
      );
    },
  });

  return result;
};

export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });

  return result;
};

export const useMyRecentSessions = () => {
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
  });

  return result;
};

export const useSessionById = (id) => {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    staleTime: Infinity,
    refetchInterval: 5000,
  });
};

export const useJoinSession = () => {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationKey: ["joinSession"],

    mutationFn: sessionApi.joinSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session"],
      });

      toast.success("Joined session successfully!");
    },

    onError: (error) => {
      console.log("JOIN SESSION ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to join session"
      );
    },
  });

  return result;
};

export const useEndSession = () => {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationKey: ["endSession"],

    mutationFn: sessionApi.endSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activeSessions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myRecentSessions"],
      });

      toast.success("Session ended successfully!");
    },

    onError: (error) => {
      console.log("END SESSION ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to end session"
      );
    },
  });

  return result;
};