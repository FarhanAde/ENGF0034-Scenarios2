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
import ContactMe from "./components/pages/ContactMe"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AboutMe from './components/pages/AboutMe'
import JavaPlatformer from './components/pages/project_pages/JavaPlatformer'
import PythonHangman from './components/pages/project_pages/PythonHangman'
import JPMForage from './components/pages/homework_pages/JPMForage'
import KumonTutor from './components/pages/homework_pages/KumonTutor'
import UCL from './components/pages/lessons_pages/UCL'
import KEGS from './components/pages/lessons_pages/KEGS'
import Leaderboard from './components/pages/Leaderboard'
import LessonDetail from "./components/pages/LessonDetail";
import HomeworkDetail from "./components/pages/HomeworkDetail";

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
        <Route path="/contact-me" element={<ContactMe/>}/>
        <Route path="/about-me" element={<AboutMe/>}/>
        <Route path="/projects/java-platformer" element={<JavaPlatformer/>}/>
        <Route path="/projects/python-hangman" element={<PythonHangman/>}/>
        <Route path="/homework/jpmorgan-swe-simulation" element={<JPMForage/>}/>
        <Route path="/homework/kumon-tutor" element={<KumonTutor/>}/>
        <Route path="/lessons/ucl" element={<UCL/>}/>
        <Route path="/lessons/kegs" element={<KEGS/>}/>
        <Route path="/leaderboard" element={<Leaderboard/>}/>
        <Route path="/lesson/:lessonId" element={<LessonDetail />} />
        <Route path="/homework/:homeworkId" element={<HomeworkDetail />} />
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
