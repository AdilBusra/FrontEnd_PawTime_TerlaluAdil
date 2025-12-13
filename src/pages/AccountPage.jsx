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
  const [imageRefreshKey, setImageRefreshKey] = useState(0); // Force image re-render

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
          // Owner: Fetch photo_url from backend just like walker
          try {
            console.log("🔍 Fetching owner profile from backend...");
            const ownerRes = await api.get("/api/users/me");
            const ownerData = ownerRes?.data?.data;
            if (ownerData) {
              console.log("✅ Owner data from backend:", ownerData);
              console.log("📸 Owner photo_url from backend:", ownerData.photo_url);
              setProfile({
                ...baseProfile,
                photo_url: ownerData.photo_url || baseProfile.photo_url,
              });
            } else {
              setProfile(baseProfile);
            }
          } catch (e) {
            console.error("❌ Failed to fetch owner profile:", e);
            setProfile(baseProfile);
          }
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
    console.log("🔄 editedProfile synced with profile:", profile);
  }, [profile]);

  // Setiap kali photo_url di profile berubah, update imageRefreshKey untuk force img re-render
  useEffect(() => {
    if (profile.photo_url && profile.photo_url.includes('http')) {
      setImageRefreshKey(prev => prev + 1);
      console.log("🔄 Image refresh triggered, key:", imageRefreshKey + 1);
    }
  }, [profile.photo_url]);

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
      
      // Validate token exists
      if (!token) {
        showAlert({
          title: "Authentication Error",
          message: "Token tidak ditemukan. Silakan login ulang.",
          type: "error",
          confirmText: "OK",
          onConfirm: () => navigate("/auth"),
        });
        return;
      }

      // Photo upload untuk owner dan walker
      let uploadedPhotoUrl = null; // Capture photo URL dari response upload
      
      if (
        editedProfile.photo_url &&
        editedProfile.photo_url !== profile.photo_url
      ) {
        console.log("🔍 Photo upload check:", {
          role: profile.role,
          walkerId,
          photoChanged: true,
        });

        try {
          // Jika foto dari file picker (data URL)
          if (editedProfile.photo_url.startsWith("data:")) {
            const formData = new FormData();
            const response = await fetch(editedProfile.photo_url);
            const blob = await response.blob();
            formData.append("photo", blob, "profile.jpg");

            if (profile.role === "walker") {
              console.log("🔍 Uploading walker photo via PUT /api/walkers/profile");
              
              // Upload photo untuk walker
              const photoUpdateRes = await api.put("/api/walkers/profile", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log("✅ Walker photo upload response:", photoUpdateRes.data);
              // Capture photo URL dari response walker_profile
              uploadedPhotoUrl = photoUpdateRes.data?.data?.photo_url;
            } else if (profile.role === "owner") {
              console.log("🔍 Uploading owner photo via PUT /api/users/me");
              
              // Upload photo untuk owner
              const photoUpdateRes = await api.put("/api/users/me", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log("✅ Owner photo upload response:", photoUpdateRes.data);
              console.log("🔍 Response structure check:", {
                hasData: !!photoUpdateRes.data?.data,
                hasPhotoUrl: !!photoUpdateRes.data?.data?.photo_url,
                photoUrlValue: photoUpdateRes.data?.data?.photo_url,
                responseKeys: Object.keys(photoUpdateRes.data?.data || {}),
                fullResponseData: photoUpdateRes.data?.data,
              });
              // Capture photo URL dari response data
              uploadedPhotoUrl = photoUpdateRes.data?.data?.photo_url;
            }
            console.log("📸 Captured uploadedPhotoUrl:", uploadedPhotoUrl);
          }
        } catch (photoErr) {
          console.error("❌ Photo upload error:", photoErr);
          console.error("📝 Full error:", photoErr.response?.data);
          showAlert({
            title: "Warning",
            message: "Foto gagal di-upload, tapi profil tetap disimpan.",
            type: "warning",
            confirmText: "OK",
          });
        }
      }

      // UPDATE: User profile ke backend DENGAN body JSON (name, phone, email only)
      console.log("📝 Updating user profile to backend:", {
        name: editedProfile.name,
        phone_number: editedProfile.phone,
        email: editedProfile.email
      });

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
          // Jika ada uploadedPhotoUrl, simpan juga ke localStorage (karena backend belum return photo_url di GET /api/users/me)
          ...(uploadedPhotoUrl && { photo_url: uploadedPhotoUrl }),
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("✅ Updated localStorage with backend data:", updatedUser);
      }

      // PENTING: Fetch ulang profile dari backend untuk mendapatkan photo_url terbaru
      console.log("🔄 Fetching updated profile from backend...");
      const profileRes = await api.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      const freshUserData = profileRes.data?.data;
      if (freshUserData) {
        console.log("✅ Fresh profile data:", freshUserData);
        console.log("🔍 Fresh photo_url from backend:", freshUserData.photo_url);
        console.log("🔍 Uploaded photo URL from response:", uploadedPhotoUrl);
        
        // Update profile state dengan data terbaru
        const updatedProfile = {
          name: freshUserData.name || editedProfile.name,
          phone: freshUserData.phone_number || editedProfile.phone,
          email: freshUserData.email || editedProfile.email,
          role: freshUserData.role || profile.role,
          // PENTING: Prioritas: uploadedPhotoUrl (dari response upload) > freshUserData.photo_url > profile.photo_url
          photo_url: uploadedPhotoUrl || freshUserData.photo_url || profile.photo_url,
          location_name: profile.role === "walker" ? (freshUserData.walker_profile?.location_name || profile.location_name) : profile.location_name,
          hourly_rate: profile.role === "walker" ? (freshUserData.walker_profile?.hourly_rate || profile.hourly_rate) : profile.hourly_rate,
          bio: profile.role === "walker" ? (freshUserData.walker_profile?.bio || profile.bio) : profile.bio,
        };
        
        console.log("🔍 DEBUG: Profile object after update:", updatedProfile);
        console.log("📋 About to exit edit mode. Updated profile photo_url:", updatedProfile.photo_url);
        
        // CRITICAL FIX: Set both profile AND editedProfile to ensure consistent state
        setProfile(updatedProfile);
        setEditedProfile(updatedProfile);
      } else {
        // Fallback: jika fetch gagal, tetap gunakan editedProfile dengan uploadedPhotoUrl jika ada
        console.warn("⚠️ freshUserData is null, using editedProfile as fallback");
        const fallbackProfile = {
          ...editedProfile,
          photo_url: uploadedPhotoUrl || editedProfile.photo_url
        };
        setProfile(fallbackProfile);
        setEditedProfile(fallbackProfile);
      }

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
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      showAlert({
        title: "Invalid File",
        message: "Please select an image file.",
        type: "warning",
        confirmText: "OK",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert({
        title: "File Too Large",
        message: "Image must be smaller than 5MB.",
        type: "warning",
        confirmText: "OK",
      });
      return;
    }

    // Read file and create data URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result;
      if (typeof dataURL === "string") {
        setEditedProfile((prev) => ({
          ...prev,
          photo_url: dataURL,
        }));
      }
    };
    reader.readAsDataURL(file);
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

  // Compute the actual photo URL used by the <img> to avoid inconsistencies
  const baseDisplayPhoto = isEditMode
    ? editedProfile.photo_url || christellaProfile
    : profile.photo_url || christellaProfile;
  
  // Add cache-buster untuk non-default photos agar browser force-fetch yang terbaru
  const displayPhoto = (baseDisplayPhoto && baseDisplayPhoto !== christellaProfile && baseDisplayPhoto.includes('http'))
    ? `${baseDisplayPhoto}?t=${imageRefreshKey}`
    : baseDisplayPhoto;

  console.log("🖼️ Display Photo Logic:", {
    isEditMode,
    profilePhotoUrl: profile.photo_url,
    editedProfilePhotoUrl: editedProfile.photo_url,
    baseDisplayPhoto,
    displayPhoto,
    imageRefreshKey,
  });

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
              src={displayPhoto}
              alt={profile.name}
              onLoad={(e) => {
                // Log the actual resource the browser loaded to avoid showing stale/null state values
                console.log("✅ Image loaded successfully from:", e.target.src);
              }}
              onError={(e) => {
                console.error("❌ Image failed to load. src:", e.target.src);
              }}
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
                  className="ganti-foto-btn"
                  onClick={() => document.getElementById("photo-input")?.click()}
                >
                  Ganti Foto
                </button>
              </>
            )}
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

            {/* Save button shown when editing (Cancel uses X) */}
            {isEditMode && (
              <div className="profile-action-buttons">
                <button
                  onClick={handleSaveAll}
                  className="profile-btn-save"
                >
                  <i className="fas fa-check"></i> Save Changes
                </button>
              </div>
            )}

            {/* Tambahkan tombol jika Walker (sembunyikan saat sedang edit) */}
            {profile.role === "walker" && !isEditMode && (
              <div className="profile-walker-buttons">
                <button
                  className="profile-walker-btn"
                  onClick={() => navigate("/setup/confirm")}
                >
                  <i className="fas fa-list-check"></i> Cek Orderan
                </button>
                <button
                  className="profile-walker-btn"
                  onClick={() => navigate("/walker/active")}
                >
                  <i className="fas fa-clock"></i> Active Bookings
                </button>
              </div>
            )}
          </div>

          {/* Edit / Cancel (X) button positioned at top-right of the profile card */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="edit-profile-icon-btn"
            title={isEditMode ? "Cancel Edit" : "Edit Profile"}
          >
            {isEditMode ? "✕" : "✎"}
          </button>
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
