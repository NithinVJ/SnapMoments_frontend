import React from 'react';
import AOS from 'aos';
import '../Style/Navigation.css';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored
  const navigate = useNavigate();
  const name=localStorage.getItem("userName")
 
  
  // Get first letter of username or default to 'U'
  const firstLetter = name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg px-4">
        <img className='logo' src='src/assets/logo.png' alt="SnapMoments Logo" />
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="item collapse navbar-collapse" id="navbarNav">
          <ul className="header navbar-nav ms-auto">
            <li className="nav-item"><a className="home1 nav-link" href="/">Home</a></li>
            <li className="nav-item"><a className="home1 nav-link" href="/events">Events</a></li>
            <li className="nav-item"><a className="home1 nav-link" href="/photographer">Photographers</a></li>
            <li className="nav-item"><a className="home1 nav-link" href="/about">About</a></li>
          </ul>
        </div>
        <div className="d-none d-lg-flex align-items-center">
          {isAuthenticated ? (
            <div className="avatar-circle" onClick={() => navigate("/dashboard")}>
              {firstLetter}
            </div>
          ) : (
            <>
              <button className="loginbtn btn btn me-2" onClick={() => navigate("/login")}>Login</button>
              <button className="signbtn btn btn" onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navigation;