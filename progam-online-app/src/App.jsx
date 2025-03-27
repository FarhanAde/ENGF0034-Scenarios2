// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import React from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./components/pages/Home"
import Projects from "./components/pages/Projects"
import Lessons from "./components/pages/Lessons"
import Homework from "./components/pages/Homework"
import Practice from "./components/pages/Practice"
import Forum from "./components/pages/Forum"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Leaderboard from './components/pages/Leaderboard'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/lessons" element={<Lessons/>}/>
        <Route path="/homework" element={<Homework/>}/>
        <Route path="/practice" element={<Practice/>}/>
        <Route path="/forum" element={<Forum/>}/>
        <Route path="/leaderboard" element={<Leaderboard/>}/>
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
