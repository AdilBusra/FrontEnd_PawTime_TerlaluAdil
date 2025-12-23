// src/pages/RatingPage.jsx (Halaman 11)
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import chris from "../assets/download(9).jpeg"; // Ambil gambar Christella dari mockData
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { useAlert } from "../hooks/useAlert";

function RatingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { alertState, showAlert, closeAlert } = useAlert();

  // Get booking data from navigation state
  const bookingId = location.state?.bookingId || null;
  const walkerName = location.state?.walkerName || "Pet Walker";
  const walkerId = location.state?.walkerId || null;

  const [rating, setRating] = useState(0); // State untuk bintang
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug: Log on mount
  useEffect(() => {
    console.log("🟦 RatingPage mounted with state:", {
      bookingId,
      walkerName,
      walkerId,
      locationState: location.state
    });
    
    // Check token
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log("🔐 Token exists:", !!token);
    console.log("👤 User data exists:", !!user);
    if (user) {
      console.log("👤 User:", JSON.parse(user));
    }
  }, []);

  const handleRatingClick = (newRating) => {
    console.log("⭐ Rating clicked:", newRating);
    setRating(newRating);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    console.log("🟡 handleSubmitRating called");
    console.log("Current state:", { rating, bookingId, walkerId, review });

    if (rating === 0) {
      console.warn("⚠️ Rating is 0");
      showAlert({
        title: "Rating Required",
        message: "Mohon berikan rating bintang terlebih dahulu.",
        type: "warning",
        confirmText: "OK",
      });
      return;
    }

    if (!bookingId) {
      console.warn("⚠️ Booking ID is missing:", bookingId);
      showAlert({
        title: "Booking ID Error",
        message:
          "Booking ID tidak ditemukan. Silakan coba lagi dari halaman booking.",
        type: "error",
        confirmText: "OK",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("🔄 Setting isSubmitting to true");

      const token = localStorage.getItem("token");
      console.log("🔐 Token check before submit:", !!token);
      if (!token) {
        console.warn("⚠️ No token found in localStorage!");
        showAlert({
          title: "Authentication Error",
          message: "Token tidak ditemukan. Silakan login kembali.",
          type: "error",
          confirmText: "OK",
          onConfirm: () => navigate("/auth")
        });
        setIsSubmitting(false);
        return;
      }

      const payload = {
        booking_id: bookingId,
        walker_id: walkerId,
        rating: rating,
        review: review.trim() || null,
      };

      console.log("📤 Submitting rating with payload:", payload);
      console.log("📍 API Base URL:", api.defaults.baseURL);
      console.log("🔐 Authorization header will be set:", `Bearer ${token.substring(0, 20)}...`);

      const response = await api.post("/api/ratings", payload);

      console.log("✅ Rating submitted successfully:", response.data);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      showAlert({
        title: "Rating Submitted",
        message: `Terima kasih atas rating dan ulasannya untuk ${walkerName}!`,
        type: "success",
        confirmText: "OK",
        onConfirm: () => navigate("/"),
      });
    } catch (error) {
      console.error("❌ Error submitting rating:");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error headers:", error.response?.headers);
      console.error("Network error?:", !error.response);

      let errorMessage = "Gagal mengirim rating. Silakan coba lagi.";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        
        if (error.response.status === 401) {
          errorMessage = "Session expired. Silakan login kembali.";
          setTimeout(() => navigate("/auth"), 2000);
        } else if (error.response.status === 403) {
          errorMessage = "Anda tidak memiliki akses untuk rating walker ini.";
        } else if (error.response.status === 409) {
          errorMessage = "Anda sudah memberikan rating untuk booking ini.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Data tidak valid. Mohon cek kembali.";
        }
      } else if (error.request) {
        // Request made but no response
        console.error("Request made but no response:", error.request);
        errorMessage = "Tidak ada respons dari server. Periksa koneksi internet Anda.";
      } else {
        // Error in request setup
        errorMessage = `Error: ${error.message}`;
      }
      
      console.log("Showing error alert with message:", errorMessage);
      
      showAlert({
        title: "Error",
        message: errorMessage,
        type: "error",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
      console.log("🔄 Setting isSubmitting to false");
    }
  };

  // Fungsi untuk merender bintang
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star-input ${i <= rating ? "active" : ""}`}
          onClick={() => handleRatingClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="rating-page-container">
      <Header />

      <form onSubmit={handleSubmitRating} className="rating-page-main">
        <h2 style={{ color: "#EFECE3", marginBottom: "30px" }}>
          Bagaimana layanan Pet Walker? ⭐️
        </h2>

        <div className="rating-content">
          {/* KIRI: Foto Profil Walker */}
          <div className="rating-profile-box">
            <img src={chris} alt={walkerName} />
            <h3 style={{ color: "white", margin: "0 0 5px" }}>{walkerName}</h3>
            <p style={{ fontSize: "14px" }}>Papua</p>
          </div>

          {/* KANAN: Review & Rating Form */}
          <div className="rating-form-area">
            <div className="review-group">
              <label htmlFor="review">Review</label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tulis pengalaman Anda di sini..."
                required
              ></textarea>
            </div>

            <div className="review-group">
              <label>Rating</label>
              <div className="rating-stars-input">{renderStars()}</div>
            </div>

            <button
              type="submit"
              className="rating-confirm-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Confirm"}
            </button>
          </div>
        </div>
      </form>

      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        confirmText={alertState.confirmText}
        onClose={closeAlert}
        onConfirm={alertState.onConfirm}
      />
    </div>
  );
}

export default RatingPage;
