import { useState } from 'react'
import { Routes,Route, Navigate } from 'react-router'
import Homepage from './pages/Homepage'
import ProblemsPage from './pages/ProblemsPage'
import { useUser } from '@clerk/react'
import toast, { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage'

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
      </Routes>
      
    </>
    
  )
}

export default App
