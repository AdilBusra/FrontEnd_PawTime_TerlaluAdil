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
  const [walkerId, setWalkerId] = useState(null);

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
              setWalkerId(me.id);
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
  // State untuk mode edit global
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  useEffect(() => {
    setEditedProfile({ ...profile });
  }, [profile]);

  const handleFieldChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleSaveAll = async () => {
    // Validate semua field tidak kosong
    if (
      !editedProfile.name?.trim() ||
      !editedProfile.phone?.trim() ||
      !editedProfile.email?.trim()
    ) {
      showAlert({
        title: "Validation Error",
        message: "Semua field wajib diisi!",
        type: "warning",
        confirmText: "OK",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Jika ada perubahan foto dan user adalah walker, update foto ke backend
      if (
        profile.role === "walker" &&
        walkerId &&
        editedProfile.photo_url &&
        editedProfile.photo_url !== profile.photo_url
      ) {
        const formData = new FormData();

        // Convert data URL to Blob jika dari file picker
        if (editedProfile.photo_url.startsWith("data:")) {
          const response = await fetch(editedProfile.photo_url);
          const blob = await response.blob();
          formData.append("photo", blob, "profile.jpg");
        }

        console.log("🔍 Uploading photo untuk walker ID:", walkerId);
        console.log("📸 FormData entries:", Array.from(formData.entries()));

        // Update walker photo
        const updateRes = await api.put(`/api/walkers/${walkerId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ Photo update response:", updateRes.data);
      }

      // Update user profile ke backend (PUT /api/users/me)
      console.log("📝 Updating user profile to backend:", {
        name: editedProfile.name,
        phone_number: editedProfile.phone,
        email: editedProfile.email
      });
      console.log("🔐 Token available:", !!token);
      console.log("🔐 Token preview:", token?.substring(0, 20) + "...");

      const updateUserRes = await api.put("/api/users/me", {
        name: editedProfile.name,
        phone_number: editedProfile.phone,
        email: editedProfile.email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log("✅ Backend update response:", updateUserRes.data);
      console.log("📋 Response status:", updateUserRes.status);

      // Update localStorage dengan data terbaru dari backend
      const updatedUserFromBackend = updateUserRes.data?.data || updateUserRes.data?.user;
      if (updatedUserFromBackend) {
        const userRaw = localStorage.getItem("user");
        const user = userRaw ? JSON.parse(userRaw) : {};
        const updatedUser = {
          ...user,
          ...updatedUserFromBackend,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("✅ Updated localStorage with backend data:", updatedUser);
      }

      setProfile(editedProfile);
      setIsEditMode(false);
      showAlert({
        title: "Success",
        message: "Profil berhasil diperbarui!",
        type: "success",
        confirmText: "OK",
      });
    } catch (err) {
      console.error("❌ Error saving profile:", err.message);
      console.error("📝 Full error:", err);
      console.error("🔍 Response status:", err.response?.status);
      console.error("🔍 Response data:", err.response?.data);
      console.error("🔍 Request config:", {
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers
      });

      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "Gagal menyimpan profil";

      showAlert({
        title: "Error",
        message: `Gagal menyimpan profil: ${errorMessage}`,
        type: "error",
        confirmText: "OK",
      });
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditMode(false);
  };

  const handlePhotoChange = (e) => {
    showAlert({
      title: "Coming Soon",
      message: "Fitur upload foto akan segera tersedia.",
      type: "info",
      confirmText: "OK",
    });
  };

  const renderDetailRow = (label, field) => (
    <div className="detail-row-account">
      <label>{label}</label>
      {isEditMode ? (
        <input
          type={field === "email" ? "email" : "text"}
          value={editedProfile[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          style={{
            flex: 1,
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #8FABD4",
            color: "#4A70A9",
          }}
        />
      ) : (
        <span>{profile[field]}</span>
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
              src={
                isEditMode
                  ? editedProfile.photo_url || christellaProfile
                  : profile.photo_url || christellaProfile
              }
              alt={profile.name}
            />
            {isEditMode && (
              <>
                <input
                  type="file"
                  id="photo-input"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <button
                  onClick={() =>
                    document.getElementById("photo-input")?.click()
                  }
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "white",
                    color: "#4A70A9",
                    border: "2px solid #4A70A9",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Ganti Foto
                </button>
              </>
            )}
          </div>

          {/* KANAN: Detail Akun */}
          <div className="profile-details">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <div style={{ flex: 1 }}>
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
              </div>

              {/* Icon Pencil di Ujung */}
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="edit-profile-icon-btn"
              >
                ✎
              </button>
            </div>

            {/* Save/Cancel Buttons saat Edit Mode */}
            {isEditMode && (
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <button
                  onClick={handleSaveAll}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Tambahkan tombol jika Walker */}
            {profile.role === "walker" && (
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    backgroundColor: "white",
                    color: "#4A70A9",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/setup/confirm")}
                >
                  Cek Orderan
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    backgroundColor: "white",
                    color: "#4A70A9",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/walker/active")}
                >
                  Active Bookings
                </button>
              </div>
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
