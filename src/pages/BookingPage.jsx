// src/pages/BookingPage.jsx (Halaman 6)
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../hooks/useAlert";

// Menerima data dari halaman Walker Detail Page (jika ada)
function BookingPage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { alertState, showAlert, closeAlert } = useAlert();

  // Get data from location.state (passed from WalkerDetailPage)
  const defaultWalkerName = location.state?.walkerName || "Pilih Walker Dulu";
  const walkerId = location.state?.walkerId || null;
  const pricePerHour = location.state?.pricePerHour || 50000;

  // Get user data from localStorage
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setUserData(user);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const [bookingForm, setBookingForm] = useState({
    walker: defaultWalkerName, // Nama Walker
    owner: userData?.name || "Loading...", // Nama owner dari localStorage
    phone: userData?.phone || userData?.phone_number || "Loading...", // Phone dari localStorage
    address: "",
    date: "",
    time: "",
    duration: 1, // Default 1 jam
  });

  // Update form when userData is loaded
  useEffect(() => {
    if (userData) {
      setBookingForm((prev) => ({
        ...prev,
        owner: userData.name || "Unknown User",
        phone: userData.phone || userData.phone_number || "-",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [id]: value,
    });
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!walkerId) {
      showAlert({
        title: "Walker ID Required",
        message:
          "Walker ID tidak ditemukan. Silakan pilih walker terlebih dahulu.",
        type: "warning",
        confirmText: "OK",
      });
      return;
    }

    try {
      // Gabungkan date dan time menjadi start_time (ISO format)
      const startDateTime = new Date(`${bookingForm.date}T${bookingForm.time}`);
      const startTime = startDateTime.toISOString();

      // Hitung total_price
      const totalPrice = pricePerHour * bookingForm.duration;

      // Payload untuk backend
      const payload = {
        walker_id: walkerId,
        start_time: startTime,
        duration: parseInt(bookingForm.duration),
        total_price: totalPrice,
      };

      console.log("Sending booking:", payload);

      // POST request ke backend
      const response = await api.post("/api/bookings", payload);

      if (response.status === 201) {
        console.log("Booking created:", response.data);

        // Extract booking data
        const createdBooking = response.data.data || response.data;
        const newBookingId = createdBooking.id || createdBooking.booking_id;

        // Navigate to waiting page with booking data
        navigate("/status/waiting", {
          state: {
            bookingId: newBookingId,
            walkerName: bookingForm.walker,
            walkerId: walkerId,
          },
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Gagal membuat booking. Silakan coba lagi.";
      showAlert({
        title: "Booking Failed",
        message: errorMessage,
        type: "error",
        confirmText: "OK",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="booking-content-wrap">
        <div className="booking-wrap">
          <div className="booking-wrap-title">
            <h2 className="booking-title">Great Choice!!!</h2>
            <p className="booking-subtitle">
              Now let's fill in some important information of yours
            </p>
          </div>

          <div className="booking-form-box">
            <form onSubmit={handleConfirmBooking}>
              <div className="booking-input-group">
                <label htmlFor="walker">Pet Walker</label>
                <input
                  type="text"
                  id="walker"
                  value={bookingForm.walker}
                  readOnly
                />
              </div>

              <div className="booking-input-group">
                <label htmlFor="owner">Pet Owner</label>
                <input
                  type="text"
                  id="owner"
                  value={bookingForm.owner}
                  readOnly
                />
              </div>

              <div className="booking-input-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={bookingForm.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-input-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={bookingForm.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-input-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={bookingForm.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-input-group">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  value={bookingForm.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-input-group">
                <label htmlFor="duration">Duration (Hours)</label>
                <input
                  type="number"
                  id="duration"
                  value={bookingForm.duration}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <button type="submit" className="confirm-booking-button">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>

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
    </>
  );
}

export default BookingPage;
