import React from "react";
import { Link } from "react-router-dom"; 
import "../style.css";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo-container">
        <div className="logo-box">
          <h2>Applicant <br /> Portal</h2>
          <p>Somaiya Vidyavihar University</p>
        </div>
      </div>

      {/* Sidebar Options */}
      <div className="sidebar-links">
        <p>Application Forms</p>

        {/* Application Status Section */}
        <div className="status-section">
          <p>Application Status</p>
          <div className="status-item">
            <FaClock className="status-icon" />{" "}
            {/* Link to Pending Applications */}
            <Link to="/pending-applications" className="sidebar-link">
              Pending
            </Link>
          </div>
          <div className="status-item">
            <FaCheckCircle className="status-icon" /> Accepted
          </div>
          <div className="status-item">
            <FaTimesCircle className="status-icon" /> Rejected
          </div>
        </div>

        {/* Other Links */}
        <Link to="/faqs" className="nav-item">FAQ's</Link>
        <br />
        <Link to="/contact" className="nav-item">Contact Us</Link>
      </div>
    </div>
  );
};

export default Sidebar;
