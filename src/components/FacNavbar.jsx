import React from "react";
import { Link } from "react-router-dom"; 
import "../style.css";
import somaiyaLogo from "../assets/somaiya-logo.png";

const FacNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar-home">
      <div className="navbar-left">
        <img src={somaiyaLogo} alt="Somaiya Logo" className="navbar-logo" />
      </div>

      <div className="navbar-center">
        <Link to="/fac/home" className="nav-link">Home</Link>
        <Link to="/fac/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/policy" className="nav-link">Policy</Link>
        <Link
          to="/"
          className="nav-link logout-btn"
          onClick={() => localStorage.removeItem("user")}
        >
          Logout
        </Link>
      </div>

      <div className="navbar-user-home">
        <span className="user-name">{user?.svvNetId || "Guest"}</span>
        <span className="user-role">{user?.branch || "Not Logged In"}</span>
      </div>
    </nav>
  );
};

export default FacNavbar;
