import { useState } from 'react'
import { Routes,Route, Navigate } from 'react-router'
import Homepage from './pages/Homepage'
import ProblemsPage from './pages/ProblemsPage'
import { useUser } from '@clerk/react'
import toast, { Toaster } from 'react-hot-toast';

function App() {
  
  const {isSignedIn}=useUser();

  return (
    <>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/problems" element={isSignedIn? <ProblemsPage/> : <Navigate to="/" />} />
      </Routes>
      
    </>
    
  )
}

export default App
