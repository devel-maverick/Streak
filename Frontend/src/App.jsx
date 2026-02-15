import React from 'react'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Companies from './pages/Companies'
import Contest from './pages/Contest'
import Payment from './pages/Payment'
import Profile from './pages/Profile'
import Playground from './pages/PlayGround'
import Practice from './pages/Practice'
import OAuthCallback from './pages/OAuthSuccess'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'

import { Toaster } from 'react-hot-toast'

export default function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/oauth-success" element={<OAuthCallback />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  )
}