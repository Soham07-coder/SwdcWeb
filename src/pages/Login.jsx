import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For future API use
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import "./login.css";
import logo from "../assets/somaiya-logo.png";
import logo1 from "../assets/trust.png";
import googleIcon from "../assets/google-logo.jpg";

const GOOGLE_CLIENT_ID = "653938123906-1qpf6dbs0u51auibm3lrmu3sg7a0gamh.apps.googleusercontent.com";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validatorError, setValidatorError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const hardcodedUsers = {
      "devanshu.d": { password: "Devanshu123", role: "student", branch: "(AI & DS)" },
      "sohamgore": { password: "12345678", role: "student", branch: "COMPS" },
      "faculty.a": { password: "faculty123", role: "faculty", branch: "COMPS" },
    };

    const userEntry = hardcodedUsers[username];

    if (userEntry && userEntry.password === password) {
      const { role, branch } = userEntry;
      localStorage.setItem("svvNetId", username);
      localStorage.setItem("user", JSON.stringify({ svvNetId: username, role, branch }));

      // 🔁 Navigate based on role
      if (role === "faculty") {
        navigate("/fac/home");
      } else {
        navigate("/home");
      }
    } else {
      setError("Invalid SVV Net ID or password.");
    }
  };

  const handleGoogleSuccess = (credentialResponse, role = "UG (AI&DS)") => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;
      const name = decoded.name;
      const svvNetId = email.split("@")[0];
      const domain = email.split("@")[1];

      if (!domain.includes("somaiya.edu")) {
        if (role === "Validator") setValidatorError("Please use a valid Somaiya email.");
        else setError("Please use a valid Somaiya email.");
        return;
      }

      const isFaculty = role === "Validator";
      const finalRole = isFaculty ? "faculty" : "student";
      const branch = isFaculty ? "All" : "AI & DS";

      localStorage.setItem("svvNetId", svvNetId);
      localStorage.setItem("user", JSON.stringify({
        svvNetId,
        role: finalRole,
        branch,
        name,
        email,
        picture: decoded.picture
      }));

      // 🔁 Navigate based on role
      if (finalRole === "faculty") {
        navigate("/fachome");
      } else {
        navigate("/home");
      }

    } catch (err) {
      console.error("Error decoding Google credential:", err);
      if (role === "Validator") setValidatorError("Google login failed.");
      else setError("Google login failed.");
    }
  };

  const handleGoogleError = (role = "UG (AI&DS)") => {
    if (role === "Validator") setValidatorError("Google login failed.");
    else setError("Google login failed.");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
            <h2 className="validator-question">Validator?</h2>
            <p className="validator-login-text">Login to go on Dashboard</p>
            {validatorError && <p className="error-message">{validatorError}</p>}
            <GoogleLogin
              onSuccess={(credentialResponse) => handleGoogleSuccess(credentialResponse, "Validator")}
              onError={() => handleGoogleError("Validator")}
              width="100%"
              text="signin_with"
              shape="pill"
              logo_alignment="left"
              useOneTap
            />
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

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="w-4 h-4" />
                <label htmlFor="remember" className="text-sm">Remember me</label>
              </div>

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="login-button">Login</button>
            </form>

            <h1 className="or">OR</h1>
            <GoogleLogin
              onSuccess={(credentialResponse) => handleGoogleSuccess(credentialResponse, "UG (AI&DS)")}
              onError={() => handleGoogleError("UG (AI&DS)")}
              width="100%"
              text="signin_with"
              shape="pill"
              logo_alignment="left"
              useOneTap
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
