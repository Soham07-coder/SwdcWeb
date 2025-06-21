import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const FacSidebar = () => {
  return (
    <div className="sidebar fac-sidebar">
      {/* Header */}
      <div className="logo-container">
        <div className="logo-box validator">
          <h2>
            Validator <br /> Portal
          </h2>
          <p>Somaiya Vidyavihar University</p>
        </div>
      </div>

      {/* Sidebar Sections */}
      <div className="sidebar-links">
        <p className="section-title">Application Forms</p>

        <hr className="divider" />

        {/* Status Section */}
        <p className="section-title">Application Status</p>

        <div className="status-item">
          <FaClock className="status-icon" />
          <Link to="/fac/pending" className="sidebar-link">Pending</Link>
        </div>

        <div className="status-item">
          <FaCheckCircle className="status-icon" />
          <Link to="/fac/approved" className="sidebar-link">Approved</Link>
        </div>

        <div className="status-item">
          <FaTimesCircle className="status-icon" />
          <Link to="/fac/rejected" className="sidebar-link">Rejected</Link>
        </div>

        <hr className="divider" />

        {/* Extra Links */}
        <Link to="/faqs" className="nav-item">FAQ’s</Link>
        <br />
        <Link to="/contact" className="nav-item">Contact Us</Link>
      </div>
    </div>
  );
};

export default FacSidebar;
