import React, { useState } from "react";
import axios from "axios";
import "../Style/SignupPage.css";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "client",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function validateForm() {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8080/Photobooking/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setServerError(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        setServerError("Server not responding. Please try again.");
      } else {
        setServerError(error.message);
      }
    }
  }

  return (
    <div className="signup-page d-flex justify-content-center align-items-center vh-100">
      <div className="signup-container p-4 rounded shadow bg-white">
        <h2 className="text-center mb-2">Create an Account</h2>
        <p className="text-muted text-center mb-4">Enter your details to sign up</p>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label d-block">Account Type</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="accountType"
                value="client"
                checked={formData.accountType === "client"}
                onChange={handleChange}
              />
              <label className="form-check-label">Client</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="accountType"
                value="photographer"
                checked={formData.accountType === "photographer"}
                onChange={handleChange}
              />
              <label className="form-check-label">Photographer</label>
            </div>
          </div>

          <button className="btn btn-maroon w-100 mt-2" type="submit">
            Create Account
          </button>
        </form>

        <div className="text-center my-3">or continue with</div>

        <div className="d-flex justify-content-center">
          <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center google-btn">
            <img
              src="https://developers.google.com/static/identity/images/branding_guideline_sample_nt_rd_sl.svg"
              alt="Google"
              className="google-icon me-2"
            />
            Google
          </button>
        </div>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <span className="text-maroon pointer" onClick={() => navigate("/login")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
