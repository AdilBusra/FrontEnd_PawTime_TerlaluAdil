// src/pages/AccountPage.jsx (Halaman 14)
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import christellaProfile from "../assets/download(9).jpeg"; // Contoh foto profil
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAlert } from "../hooks/useAlert";

function AccountPage() {
  const navigate = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();
  const [profile, setProfile] = useState({
    name: "-",
    phone: "-",
    email: "-",
    role: "-",
    photo_url: null,
    location_name: "-",
    hourly_rate: null,
    bio: "-",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRaw = localStorage.getItem("user");
        if (!token || !userRaw) {
          showAlert({
            title: "Authentication Required",
            message: "Anda belum login. Silakan login terlebih dahulu.",
            type: "warning",
            confirmText: "OK",
            onConfirm: () => navigate("/auth"),
          });
          return;
        }

        const user = JSON.parse(userRaw);
        const role = user.role || "-";
        const baseProfile = {
          name: user.name || "-",
          phone: user.phone_number || user.number || "-",
          email: user.email || "-",
          role: role,
          photo_url: null,
          location_name: "-",
          hourly_rate: null,
          bio: "-",
        };

        if (role === "walker") {
          try {
            // Since there is no /me endpoint, fetch all walkers and find current by user id
            const walkersRes = await api.get("/api/walkers");
            const arr =
              walkersRes?.data?.data || walkersRes?.data?.walkers || [];
            const me = Array.isArray(arr)
              ? arr.find((w) => w.id === user.id)
              : null; // id returned is user_id in list
            if (me) {
              setProfile({
                ...baseProfile,
                photo_url: me.photo_url || baseProfile.photo_url,
                location_name: me.location_name || baseProfile.location_name,
                hourly_rate: me.hourly_rate ?? baseProfile.hourly_rate,
                bio: me.bio || baseProfile.bio,
              });
            } else {
              setProfile(baseProfile);
            }
          } catch (e) {
            setProfile(baseProfile);
          }
        } else {
          setProfile(baseProfile);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to load account:", err);
        setError("Gagal memuat data akun. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [navigate]);
  // State untuk mode edit (simulasi)
  const [isEditing, setIsEditing] = useState(null); // null, 'name', 'phone', atau 'email'
  const [tempValue, setTempValue] = useState("");

  const handleEditClick = (field) => {
    setIsEditing(field);
    setTempValue(profile[field]); // Isi nilai sementara dengan nilai saat ini
  };

  const handleSaveEdit = (field) => {
    if (tempValue.trim() === "") {
      showAlert({
        title: "Validation Error",
        message: "Nilai tidak boleh kosong!",
        type: "warning",
        confirmText: "OK",
      });
      return;
    }
    setProfile({ ...profile, [field]: tempValue });
    setIsEditing(null);
    showAlert({
      title: "Success",
      message: `Detail ${field} berhasil diubah!`,
      type: "success",
      confirmText: "OK",
    });
  };

  const renderDetailRow = (label, field) => (
    <div className="detail-row-account">
      <label>{label}</label>
      {isEditing === field ? (
        <>
          <input
            type={field === "email" ? "email" : "text"}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            style={{
              flex: 1,
              padding: "5px",
              borderRadius: "5px",
              border: "none",
              color: "#4A69BB",
            }}
          />
          <span
            className="edit-icon"
            onClick={() => handleSaveEdit(field)}
            style={{ color: "#A3D8A5", cursor: "pointer" }}
          >
            ✓
          </span>
        </>
      ) : (
        <>
          <span>{profile[field]}</span>
          <span className="edit-icon" onClick={() => handleEditClick(field)}>
            ✎
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="account-page-container">
      <Header />

      <div className="account-page-main">
        <h2 className="profile-heading">Your Amazing Profile ❤️</h2>
        {loading && <p className="loading-message">Loading your profile...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="profile-card">
          {/* KIRI: Foto Profil */}
          <div className="profile-photo-container">
            <img
              src={profile.photo_url || christellaProfile}
              alt={profile.name}
            />
            <button className="edit-photo-btn">edit ✎</button>
          </div>

          {/* KANAN: Detail Akun */}
          <div className="profile-details">
            {renderDetailRow("Name", "name")}
            {renderDetailRow("Phone Number", "phone")}
            {renderDetailRow("Email", "email")}
            {profile.role === "walker" && (
              <>
                {renderDetailRow("Location", "location_name")}
                {renderDetailRow("Fee / Hour", "hourly_rate")}
                {renderDetailRow("Bio", "bio")}
              </>
            )}

            {/* Tambahkan tombol jika Walker */}
            {profile.role === "walker" && (
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#FFD700",
                  color: "#4A69BB",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  marginTop: "20px",
                }}
                onClick={() => navigate("/setup/confirm")}
              >
                Cek Konfirmasi Booking
              </button>
            )}
          </div>
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
  );
}

export default AccountPage;
