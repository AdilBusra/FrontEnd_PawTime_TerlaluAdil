// src/hooks/useAlert.js
import { useState, useCallback } from "react";

export function useAlert() {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "OK",
    cancelText: "Cancel",
    showCancel: false,
    onConfirm: null,
  });

  const showAlert = useCallback((options) => {
    setAlertState({
      isOpen: true,
      title: options.title || "Notification",
      message: options.message || "",
      type: options.type || "info",
      confirmText: options.confirmText || "OK",
      cancelText: options.cancelText || "Cancel",
      showCancel: options.showCancel || false,
      onConfirm: options.onConfirm || null,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alertState,
    showAlert,
    closeAlert,
  };
}
