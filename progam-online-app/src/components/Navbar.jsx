import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import "./Navbar.css";

function Navbar() {
  const [clicked, setClicked] = useState(false);
  const { activeUser } = useUser();
  const handleClick = () => setClicked(!clicked);
  const closeMenu = () => setClicked(false);

  // Now you can use activeUser.id anywhere in this component
  // console.log(activeUser.id); // Will print 0

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Program<i className="bi bi-outlet"></i>nline
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={clicked ? "bi bi-x-square": "bi bi-list"}></i>
        </div>
        <ul className={clicked ? "nav-menu active": "nav-menu"}>
          <li className="nav-item">
            <Link to="/homework" className="nav-link" onClick={closeMenu}>
              Homework
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/lessons" className="nav-link" onClick={closeMenu}>
              Lessons
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/practice" className="nav-link" onClick={closeMenu}>
              Practice
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/projects" className="nav-link" onClick={closeMenu}>
              Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/forum" className="nav-link" onClick={closeMenu}>
              Forum
            </Link>
          </li>
        </ul>
        <div className="navbar-icons">
          <button className="icon-button">
            <i className="bi bi-search"></i>
          </button>
          <button className="icon-button">
            <i className="bi bi-bell"></i>
          </button>
          <Link to="/profile" className="icon-button">
            <i className="bi bi-person-circle"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;