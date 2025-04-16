import React, { useState } from 'react';
import '../Style/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/Photobooking/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        alert("Login Successful!");
        navigate("/portfolio");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-box p-4 shadow rounded-4 bg-white">
        <h2 className="text-center fw-bold">Welcome Back</h2>
        <p className="text-muted text-center mb-4">Sign in to your SnapMoments account</p>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form className="login" onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input type="email" className="form-control" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label d-flex justify-content-between">
              Password
              <a href="/" className="text-decoration-none text-maroon">Forgot Password?</a>
            </label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input type="password" className="form-control" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-maroon w-100">Sign In</button>

          <div className="text-center my-3">Or continue with</div>

          <div className="d-flex justify-content-center gap-3">
            <button type="button" className="btn btn-outline-secondary d-flex align-items-center google">
              <img src="https://developers.google.com/static/identity/images/branding_guideline_sample_nt_rd_sl.svg" alt="Google" className="google-icon me-2" /> Google
            </button>
            <button type="button" className="btn btn-outline-secondary d-flex align-items-center facebook">
              <i className="bi bi-facebook me-2"></i> Facebook
            </button>
          </div>
        </form>

        <p className="text-center mt-4">
          Don't have an account? <span className="text-maroon cursor-pointer" onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
