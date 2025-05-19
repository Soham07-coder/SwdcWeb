import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import logo from "../assets/somaiya-logo.png";
import logo1 from "../assets/trust.png";
import googleIcon from "../assets/google-logo.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Hardcoded credentials
    const hardcodedUsers = {
      "devanshu.d": "Devanshu123",
      "sohamgore": "12345678",
    };

    if (hardcodedUsers[username] === password) {
      // Store in localStorage
      localStorage.setItem("svvNetId", username);
      localStorage.setItem("user", JSON.stringify({ svvNetId: username, role: "UG (AI&DS)" }));

      console.log("Stored svvNetId:", localStorage.getItem("svvNetId")); // Debugging

      navigate("/home");
    } else {
      setError("Invalid credentials!");
    }

    // Optional: Uncomment this if you want to send login requests to an API
    // try {
    //   const res = await axios.post("http://localhost:5000/api/auth/login", { svvNetId: username, password });
    //   if (res.status === 200 && res.data.token) {
    //     localStorage.setItem("token", res.data.token);
    //     localStorage.setItem("svvNetId", username);
    //     localStorage.setItem("user", JSON.stringify({ svvNetId: username, role: "UG (AI&DS)" }));
    //     navigate("/home");
    //   } else {
    //     setError("Login failed. Please try again.");
    //   }
    // } catch (err) {
    //   setError(err.response?.data?.message || "Login failed.");
    // }
  };

  return (
    <div className="login-page">
      {/* Navbar */}
      <div className="navbar">
        <img src={logo} alt="Somaiya Logo" className="navbar-logo" />
        <h1 className="navbar-title">Welcome to Student Development Cell</h1>
        <img src={logo1} alt="Somaiya Trust Logo" className="navbar-logo1" />
      </div>

      {/* Login Container */}
      <div className="login-container">
        {/* Validator Box */}
        <div className="validator-box">
          <h1 className="validator-title">
            <span className="highlight">Student</span> <br />
            <span className="highlight">Development Cell</span>
          </h1>
          <p className="description">
            The Student Development Policy at K. J. Somaiya College of Engineering reflects our 
            commitment to fostering a dynamic and enriching academic environment for students across all levels of study.
          </p>
          <h2 className="validator-question">Validator ?</h2>

          <p className="validator-login-text">Login to go on Dashboard</p>
          <button className="google-login">
            <img src={googleIcon} alt="Google" className="icon" /> Login with Somaiya mail
          </button>
        </div>

        {/* Student Login Box */}
        <div className="student-login-box">
          <h2 className="form-title">Please enter your SVV Net ID & password to Login.</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <label>SVV Net ID *</label>
            <input
              type="text"
              placeholder="Enter your SVV Net ID"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button">Login</button>
          </form>
          <h1 className="or">OR</h1>
          <button className="google-login">
            <img src={googleIcon} alt="Google" className="icon" /> Login with Somaiya mail
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
