import React from "react";
import "./Modal.css";

export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
