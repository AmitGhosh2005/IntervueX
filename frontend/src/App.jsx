import { useState } from 'react'
import { Routes,Route, Navigate } from 'react-router'
import { useUser } from '@clerk/react'
import toast, { Toaster } from 'react-hot-toast';

import Homepage from './pages/Homepage'
import ProblemsPage from './pages/ProblemsPage'
import DashboardPage from './pages/DashboardPage'
import ProblemPage from './pages/ProblemPage'
import SessionPage from './pages/SessionPage';

function App() {
  
  const {isSignedIn,isLoaded}=useUser();

  if(!isLoaded) return null;

  return (
    <>
      <Toaster/>
      <Routes>
        <Route path="/" element={!isSignedIn? <Homepage/>: <Navigate to={"/dashboard"}/>} />
        <Route path="/dashboard" element={isSignedIn? <DashboardPage/>: <Navigate to={"/"}/>} />
        <Route path="/problems" element={isSignedIn? <ProblemsPage/> : <Navigate to="/" />} />
        <Route path="/problems/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      </Routes>
      
    </>
    
  )
}

export default App
