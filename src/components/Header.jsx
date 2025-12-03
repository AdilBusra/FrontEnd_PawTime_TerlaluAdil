// src/components/Header.jsx (SETELAH PERUBAHAN)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- BARU
import AlertModal from "./AlertModal";

// Tidak lagi menerima prop navigateTo
function Header({ userRole }) {
  const navigate = useNavigate(); // <-- Panggil Hook
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");

  // FUNGSI UTAMA UNTUK NAVIGASI KONDISIONAL
  const handleNavClick = (e, targetPage) => {
    e.preventDefault();

    // Rute yang membutuhkan otentikasi (SEKARANG TERMASUK 'walker')
    const requiresAuth = targetPage === "walkers" || targetPage === "history"; // Ubah 'walker' menjadi URL path '/walkers'

    // 1. Jika BELUM LOGIN dan mencoba mengakses fitur yang membutuhkan Auth
    if (!isLoggedIn && requiresAuth) {
      navigate("/auth"); // Arahkan ke halaman Login/Register (Menggunakan URL path /auth)
    }
    // 2. Jika SUDAH LOGIN dan mengklik "Account" (targetPage='auth')
    else if (isLoggedIn && targetPage === "auth") {
      navigate("/account"); // Bawa ke Dashboard (Menggunakan URL path /account)
    }
    // 3. Untuk semua kasus lainnya (Landing Page, atau sudah login dan menuju fitur)
    else {
      // Perhatikan mapping URL:
      // 'walker' -> '/walkers' (sesuai App.jsx)
      // 'auth' -> '/auth'
      const urlPath = targetPage === "walker" ? "/walkers" : `/${targetPage}`;
      navigate(urlPath);
    }
  };

  // Handle Logout
  const handleLogout = (e) => {
    e.preventDefault();
    setShowLogoutAlert(true);
  };

  const confirmLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to landing page
    navigate("/");

    // Optional: Reload page to reset state
    window.location.reload();
  };

  return (
    <header className="main-header-container">
      <div className="navbar-content">
        <div className="logo-section">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }} // Navigasi ke root path
          >
            <span className="logo-text">Paw Time</span>
            <span className="logo-icon">🐾</span>
          </a>
        </div>

        <nav className="action-nav">
          <a
            href="#"
            className="nav-link"
            onClick={(e) => handleNavClick(e, "walker")} // Pet Walker (mengarah ke /walkers)
          >
            Pet Walker
          </a>
          <span className="separator">|</span>
          <a
            href="#"
            className="nav-link"
            onClick={(e) => handleNavClick(e, "history")} // History (mengarah ke /history)
          >
            History
          </a>
          <span className="separator">|</span>
          <a
            href="#"
            className="nav-link"
            onClick={(e) => handleNavClick(e, "auth")} // Account (mengarah ke /auth atau /account)
          >
            Account
          </a>

          {/* Show Logout button if logged in */}
          {isLoggedIn && (
            <>
              <span className="separator">|</span>
              <a
                href="#"
                className="nav-link"
                onClick={handleLogout}
                style={{ color: "#ff6b6b" }}
              >
                Logout
              </a>
            </>
          )}
        </nav>
      </div>

      <AlertModal
        isOpen={showLogoutAlert}
        title="Logout Confirmation"
        message="Apakah Anda yakin ingin logout?"
        type="confirm"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={confirmLogout}
        onClose={() => setShowLogoutAlert(false)}
      />
    </header>
  );
}

export default Header;
