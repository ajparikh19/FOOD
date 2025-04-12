import React from "react";
import "./Modal.css";

export default function Modal({ show, onClose, title, children }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>

        <div className="modal-body">{children}</div>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
