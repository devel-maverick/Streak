import React from 'react'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Companies from './pages/Companies'
import Contest from './pages/Contest'
import Payment from './pages/Payment'
import Profile from './pages/Profile'
import Playground from './pages/PlayGround'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
export default function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}