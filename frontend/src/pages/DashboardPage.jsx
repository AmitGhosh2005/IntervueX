import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { useUser} from "@clerk/react";
import {useCreateSession , useActiveSessions , useMyRecentSessions} from "../hooks/useSessions"


function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModel, setShowCreateModal] = useState(false);
  const [roomConfig , setRoomConfig] = useState({problem: "", difficulty: ""});

  const createSessionMutation = useCreateSession();
  const {data:activeSessionsData , isLoading:loadingActiveSessions} = useActiveSessions();
  const {data:recentSessionData , isLoading:loadingRecentSessions} = useMyRecentSessions();
  console.log("activeSessionsData", activeSessionsData);
  console.log("recentSessionData", recentSessionData);
  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage