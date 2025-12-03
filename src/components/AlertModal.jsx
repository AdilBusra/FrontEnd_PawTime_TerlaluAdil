// src/components/AlertModal.jsx
import React from "react";
import "../styles/AlertModal.css";

function AlertModal({
  isOpen,
  title = "Notification",
  message = "",
  type = "info", // 'info', 'success', 'error', 'warning', 'confirm'
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "confirm":
        return "?";
      default:
        return "ℹ";
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#f44336";
      case "warning":
        return "#ff9800";
      case "confirm":
        return "#2196F3";
      default:
        return "#4A70A9";
    }
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          className="alert-modal-icon"
          style={{ backgroundColor: getTypeColor() }}
        >
          {getIcon()}
        </div>

        <div className="alert-modal-body">
          <h2 className="alert-modal-title">{title}</h2>
          <p className="alert-modal-message">{message}</p>
        </div>

        <div className="alert-modal-actions">
          {showCancel && (
            <button className="alert-modal-btn cancel-btn" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button
            className="alert-modal-btn confirm-btn"
            style={{ backgroundColor: getTypeColor() }}
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              } else {
                onClose();
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
