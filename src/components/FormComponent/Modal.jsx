// Modal.jsx
import React, { useEffect } from 'react';
import '../styles/Modal.css'; // Ensure this path is correct

const Modal = ({ isOpen, onClose, children, title }) => {
  // UseEffect to manage body scrollbar, similar to previous version.
  // This is good practice to prevent content behind the modal from scrolling.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts or isOpen changes
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    // Overlay for dimming background and catching clicks outside modal
    <div className="modal-overlay">
      {/* Modal Container */}
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{title || "View Content"}</h2>
          <button
            onClick={onClose}
            className="modal-close-button"
            aria-label="Close modal"
          >
            &times; {/* HTML entity for a multiplication sign (often used as a close 'X') */}
          </button>
        </div>

        {/* Modal Body (where dynamic content will be rendered) */}
        <div className="modal-body-content">
          {children} {/* This is where the iframe or other content will be injected */}
        </div>
      </div>
    </div>
  );
};

export default Modal;