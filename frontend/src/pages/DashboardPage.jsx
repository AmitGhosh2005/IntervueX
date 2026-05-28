import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { useUser} from "@clerk/react";
import {useCreateSession , useActiveSessions , useMyRecentSessions} from "../hooks/useSessions"

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";



function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModel, setShowCreateModal] = useState(false);
  const [roomConfig , setRoomConfig] = useState({problem: "", difficulty: ""});

  const createSessionMutation = useCreateSession();
  const {data:activeSessionsData , isLoading:loadingActiveSessions} = useActiveSessions();
  const {data:recentSessionsData , isLoading:loadingRecentSessions} = useMyRecentSessions();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: async (data) => {
        console.log("SESSION CREATED:", data);

        setShowCreateModal(false);

        // small delay so queries + stream initialize properly
        setTimeout(() => {
          navigate(`/session/${data.session._id}`);
        }, 500);
      },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModel}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;