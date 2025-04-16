import React from 'react'
import AOS from 'aos';
import'../Style/Navigation.css'
;
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  return (
    <>
    {/* Navbar */}
<nav className="navbar navbar-expand-lg   px-4">
{/* <a className="navbar-brand fw-bolder fs-3 ">SnapMoments</a> */}
<img className='logo' src='src/assets/logo.png' />
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
<div className="d-none d-lg-block">
  <button className="loginbtn btn btn me-2" onClick={() => navigate("/login")}>Login</button>
  <button className="signbtn btn btn" onClick={() => navigate("/signup")}>Sign Up</button>
</div>
</nav>
</>
  )
}

export default Navigation




// const navigate = useNavigate();
// onClick={() => navigate("/login")}>Login</button>
//   <button className="signbtn btn btn" onClick={() => navigate("/signup")}