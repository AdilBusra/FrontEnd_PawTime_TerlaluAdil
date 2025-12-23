// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api";

function HistoryPage({ userRole: propUserRole }) {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // all, completed, cancelled

  // Ambil userRole dari localStorage jika prop tidak tersedia
  const getUserRole = () => {
    if (propUserRole) return propUserRole;

    try {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        return user.role || "owner"; // Default ke owner jika tidak ada role
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }

    return "owner"; // Fallback default
  };

  const userRole = getUserRole();

  // Handler untuk tombol "Leave Review"
  const handleLeaveReview = (bookingItem) => {
    console.log("🟡 [handleLeaveReview] Clicked");
    console.log("📋 Booking data:", bookingItem);

    if (!bookingItem) {
      console.error("❌ Booking data is missing");
      return;
    }

    const { id: bookingId, walker_id: walkerId, walker_name: walkerName } = bookingItem;

    console.log("📤 Navigating to RatingPage with:", {
      bookingId,
      walkerId,
      walkerName,
    });

    // Navigate ke RatingPage dengan booking data
    navigate("/rating", {
      state: {
        bookingId,
        walkerId,
        walkerName,
      },
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Tentukan endpoint berdasarkan role user
        // Backend menggunakan endpoint yang sama untuk owner dan walker
        // Backend akan otomatis filter berdasarkan user_id dan role dari JWT token
        let endpoint = "/api/bookings/history";

        const response = await api.get(endpoint);

        console.log("History Response:", response.data);

        let dataArray = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else if (Array.isArray(response.data)) {
          dataArray = response.data;
        }

        setHistoryData(dataArray);
        setError(null);
      } catch (err) {
        console.error("Error fetching history:", err);

        // Handle different error types
        if (err.response?.status === 500) {
          // 500 error bisa karena server error atau endpoint tidak support empty data
          // Treat sebagai "no data" - mungkin user belum punya history
          console.log("Server Error 500 - Kemungkinan belum ada data history");
          setHistoryData([]);
          setError(null); // Tidak tampilkan error, tapi kosong aja
        } else if (err.response?.status === 404) {
          // 404 = endpoint tidak ketemu atau data tidak ketemu
          console.log("History data not found");
          setHistoryData([]);
          setError(null);
        } else if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          setError("Unauthorized access. Please login again.");
          setHistoryData([]);
        } else if (err.message === "Network Error") {
          setError("Network connection problem. Check your internet.");
          setHistoryData([]);
        } else {
          // Error lainnya - tampilkan pesan tapi jangan crash
          setError("Unable to load history. Please refresh the page.");
          setHistoryData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userRole]);

  // Filter data berdasarkan status
  const filteredData =
    filterStatus === "all"
      ? historyData
      : historyData.filter(
          (item) => item.status?.toLowerCase() === filterStatus
        );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#4CAF50"; // Hijau
      case "cancelled":
        return "#f44336"; // Merah
      case "pending":
        return "#ff9800"; // Orange
      default:
        return "#8FABD4"; // Default biru
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { icon: "fa-check-circle", text: "Completed" },
      cancelled: { icon: "fa-times-circle", text: "Cancelled" },
      pending: { icon: "fa-clock", text: "Pending" },
      in_progress: { icon: "fa-spinner fa-spin", text: "In Progress" },
    };
    const badge = statusMap[status?.toLowerCase()] || { icon: "fa-info-circle", text: status };
    return badge;
  };

  return (
    <div className="history-page-container">
      <Header userRole={userRole} />

      <div className="history-main">
        <h2 className="history-title">
          <i className={`fas ${userRole === "walker" ? "fa-list" : "fa-history"}`}></i>
          {userRole === "walker" ? "My Orders" : "Booking History"}
        </h2>

        {/* Filter Buttons */}
        <div className="history-filter">
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            <i className="fas fa-th-large"></i> All
          </button>
          <button
            className={`filter-btn ${
              filterStatus === "completed" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("completed")}
          >
            <i className="fas fa-check-circle"></i> Completed
          </button>
          <button
            className={`filter-btn ${
              filterStatus === "cancelled" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("cancelled")}
          >
            <i className="fas fa-times-circle"></i> Cancelled
          </button>
        </div>

        {loading && (
          <p className="loading-message">
            <i className="fas fa-spinner fa-spin"></i> Loading history...
          </p>
        )}

        {error && (
          <div className="error-message-box">
            <p className="error-message">
              <i className="fas fa-exclamation-triangle"></i> {error}
            </p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-redo"></i> Retry
            </button>
          </div>
        )}

        {/* History List */}
        <div className="history-list">
          {!loading && !error && filteredData.length > 0
            ? filteredData.map((item) => {
                const statusBadge = getStatusBadge(item.status);
                return (
                  <div key={item.id} className="history-card">
                    <div className="history-card-header">
                      <div className="history-info">
                        <h3 className="history-pet-name">
                          {userRole === "walker"
                            ? `${item.pet_name || "Pet"}`
                            : `${item.walker_name || "Walker"}`}
                        </h3>
                        <p className="history-date">
                          <i className="fas fa-calendar-alt"></i>
                          {new Date(
                            item.booking_date || item.created_at
                          ).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div
                        className="history-status-badge"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      >
                        <i className={`fas ${statusBadge.icon}`}></i>
                        {statusBadge.text}
                      </div>
                    </div>

                    <div className="history-card-body">
                      <div className="history-detail-row">
                        <span className="history-label">
                          <i className={`fas ${userRole === "walker" ? "fa-user" : "fa-person-walking"}`}></i>
                          {userRole === "walker" ? "Owner:" : "Walker:"}
                        </span>
                        <span className="history-value">
                          {userRole === "walker"
                            ? item.owner_name
                            : item.walker_name}
                        </span>
                      </div>

                      <div className="history-detail-row">
                        <span className="history-label">
                          <i className="fas fa-hourglass-half"></i>
                          Duration:
                        </span>
                        <span className="history-value">
                          {item.duration || item.booking_duration} mins
                        </span>
                      </div>

                      <div className="history-detail-row">
                        <span className="history-label">
                          <i className="fas fa-money-bill"></i>
                          Price:
                        </span>
                      <span className="history-value history-price">
                        Rp{" "}
                        {(item.total_price || item.price)?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                    </div>

                    {item.notes && (
                      <div className="history-detail-row">
                        <span className="history-label">
                          <i className="fas fa-sticky-note"></i>
                          Notes:
                        </span>
                        <span className="history-value">{item.notes}</span>
                      </div>
                    )}

                    {item.rating && userRole === "owner" && (
                      <div className="history-detail-row">
                        <span className="history-label">
                          <i className="fas fa-star"></i>
                          Rating:
                        </span>
                        <span className="history-value">
                          {"⭐".repeat(item.rating)} ({item.rating}/5)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="history-card-footer">
                    {item.status?.toLowerCase() === "completed" &&
                      !item.rating &&
                      userRole === "owner" && (
                        <button
                          className="history-action-btn"
                          onClick={() => handleLeaveReview(item)}
                        >
                          <i className="fas fa-pen"></i> Leave Review
                        </button>
                      )}
                    {item.rating &&
                      userRole === "owner" && (
                        <button className="history-action-btn" disabled>
                          <i className="fas fa-check"></i> Review Submitted
                        </button>
                      )}
                    {item.status?.toLowerCase() === "pending" &&
                      userRole === "walker" && (
                        <>
                          <button className="history-action-btn accept-btn">
                            <i className="fas fa-check"></i> Accept
                          </button>
                          <button className="history-action-btn reject-btn">
                            <i className="fas fa-times"></i> Reject
                          </button>
                        </>
                      )}
                  </div>
                </div>
                );
              })
            : !loading &&
              !error && (
                <div className="no-history-container">
                  <p className="no-history-message">
                    {userRole === "walker"
                      ? "📭 Belum ada orderan yang diterima"
                      : "📭 Belum ada orderan yang dibuat"}
                  </p>
                  <p className="no-history-subtitle">
                    {userRole === "walker"
                      ? "Mulai terima orderan dari pet owner untuk melihat history di sini"
                      : "Mulai pesan pet walker untuk melihat history booking Anda di sini"}
                  </p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
