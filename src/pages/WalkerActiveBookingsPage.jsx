// src/pages/WalkerActiveBookingsPage.jsx - NEW PAGE
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAlert } from "../hooks/useAlert";

function WalkerActiveBookingsPage() {
  const navigate = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accepted bookings untuk walker ini
  useEffect(() => {
    const fetchActiveBookings = async () => {
      try {
        setLoading(true);
        // Fetch bookings yang accepted/in-progress untuk walker ini
        const response = await api.get("/api/bookings/walker/active");

        console.log("Active bookings:", response.data);

        // Extract array dari response
        let bookingsArray = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          bookingsArray = response.data.data;
        } else if (Array.isArray(response.data)) {
          bookingsArray = response.data;
        }

        setActiveBookings(bookingsArray);
        setError(null);
      } catch (err) {
        console.error("Error fetching active bookings:", err);
        setError("Gagal memuat booking aktif. Silakan coba lagi.");
        setActiveBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBookings();
  }, []);

  const handleStartTracking = (booking) => {
    navigate("/walker-tracking", {
      state: {
        bookingId: booking.id,
        ownerName: booking.owner?.name || booking.owner_name || "Pet Owner",
      },
    });
  };

  const handleFinishBooking = async (bookingId) => {
    showAlert({
      title: "Selesaikan Booking",
      message: "Apakah Anda yakin sudah menyelesaikan walking session ini?",
      type: "confirm",
      confirmText: "Ya, Selesai",
      cancelText: "Batal",
      onConfirm: async () => {
        try {
          // Update booking status to completed
          // Try different endpoint formats in case backend expects different route
          let response;
          try {
            // Try PATCH /api/bookings/:id with status in body
            response = await api.patch(`/api/bookings/${bookingId}`, {
              status: "completed",
            });
          } catch (patchError) {
            console.warn("PATCH /api/bookings/:id failed, trying /status endpoint:", patchError.response?.status);
            // Fallback: Try PATCH /api/bookings/:id/status
            response = await api.patch(`/api/bookings/${bookingId}/status`, {
              status: "completed",
            });
          }

          console.log("Booking completed:", response.data);

          showAlert({
            title: "Booking Selesai",
            message: "Walking session telah selesai! Owner akan diminta untuk memberikan rating.",
            type: "success",
            confirmText: "OK",
            onConfirm: () => {
              // Refresh list setelah complete
              setActiveBookings((prev) => prev.filter((b) => b.id !== bookingId));
              // Close alert modal after action
              closeAlert();
            },
          });
        } catch (error) {
          console.error("Error completing booking:", error);
          showAlert({
            title: "Error",
            message:
              error.response?.data?.message ||
              "Gagal menyelesaikan booking. Silakan coba lagi.",
            type: "error",
            confirmText: "OK",
            onConfirm: () => {
              closeAlert();
            },
          });
        }
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header />
      <div className="walker-confirmation-container">
        <div className="walker-confirmation-content">
          <h1 className="walker-confirmation-title">
            <i className="fas fa-calendar-check"></i> Active Bookings
          </h1>
          <p className="walker-confirmation-subtitle">
            Booking yang sudah diterima dan siap dimulai
          </p>

          {loading && (
            <div className="walker-confirmation-loading">
              <p>Loading...</p>
            </div>
          )}

          {error && (
            <div className="walker-confirmation-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && activeBookings.length === 0 && (
            <div className="walker-confirmation-empty">
              <div className="empty-state">
                <i className="fas fa-inbox empty-icon"></i>
                <h3>Tidak Ada Booking Aktif</h3>
                <p>
                  Belum ada booking yang diterima dan siap dimulai saat ini.
                </p>
              </div>
            </div>
          )}

          {!loading && activeBookings.length > 0 && (
            <div className="walker-confirmation-list">
              {activeBookings.map((booking) => (
                <div key={booking.id} className="walker-active-booking-card">
                  <div className="booking-card-header">
                    <div className="owner-info">
                      <i className="fas fa-user owner-icon"></i>
                      <div className="owner-details">
                        <h3 className="owner-name">
                          {booking.owner?.name || booking.owner_name || "Unknown Owner"}
                        </h3>
                        <span
                          className={`status-badge badge-${
                            booking.status === "accepted"
                              ? "accepted"
                              : "in-progress"
                          }`}
                        >
                          <i className={`fas ${booking.status === "accepted" ? "fa-check-circle" : "fa-running"}`}></i>
                          {booking.status === "accepted"
                            ? "Accepted"
                            : "In Progress"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-card-body">
                    <div className="detail-row">
                      <div className="detail-group">
                        <span className="detail-icon">
                          <i className="fas fa-calendar"></i>
                        </span>
                        <div className="detail-content">
                          <span className="detail-label">Date</span>
                          <span className="detail-value">
                            {formatDate(booking.start_time)}
                          </span>
                        </div>
                      </div>
                      <div className="detail-group">
                        <span className="detail-icon">
                          <i className="fas fa-clock"></i>
                        </span>
                        <div className="detail-content">
                          <span className="detail-label">Time</span>
                          <span className="detail-value">
                            {formatTime(booking.start_time)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-row">
                      <div className="detail-group">
                        <span className="detail-icon">
                          <i className="fas fa-hourglass-half"></i>
                        </span>
                        <div className="detail-content">
                          <span className="detail-label">Duration</span>
                          <span className="detail-value">
                            {booking.duration || "-"} hour(s)
                          </span>
                        </div>
                      </div>
                      <div className="detail-group">
                        <span className="detail-icon">
                          <i className="fas fa-money-bill"></i>
                        </span>
                        <div className="detail-content">
                          <span className="detail-label">Price</span>
                          <span className="detail-value">
                            Rp {(booking.total_price || 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-full">
                      <span className="detail-icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <div className="detail-content">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">
                          {booking.address || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="detail-full">
                      <span className="detail-icon">
                        <i className="fas fa-phone"></i>
                      </span>
                      <div className="detail-content">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">
                          {booking.owner?.phone || booking.owner_phone || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-card-actions">
                    <button
                      className="action-button btn-primary"
                      onClick={() => handleStartTracking(booking)}
                    >
                      <i className="fas fa-location-arrow"></i> Start Tracking
                    </button>
                    <button
                      className="action-button btn-success"
                      onClick={() => handleFinishBooking(booking.id)}
                    >
                      <i className="fas fa-check"></i> Finish Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
        onClose={closeAlert}
      />
    </>
  );
}

export default WalkerActiveBookingsPage;
