import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./components/pages/Home"
import Projects from "./components/pages/Projects"
import Lessons from "./components/pages/Lessons"
import Homework from "./components/pages/Homework"
import Practice from "./components/pages/Practice"
import Forum from "./components/pages/Forum"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Leaderboard from './components/pages/Leaderboard'
import LessonDetail from "./components/pages/LessonDetail";
import HomeworkDetail from "./components/pages/HomeworkDetail";
import Profile from "./components/pages/Profile";
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
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
          <Route path="/lesson/:lessonId" element={<LessonDetail />} />
          <Route path="/homework/:homeworkId" element={<HomeworkDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer/>
      </Router>
    </UserProvider>
  )
}

export default App
