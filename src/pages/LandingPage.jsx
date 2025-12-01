// src/pages/LandingPage.jsx
import React from "react";
import Header from "../components/Header";
import gambar1 from "../assets/1.png"; // Ganti dengan nama file gambar Anda
import { useNavigate } from 'react-router-dom';

function LandingPage({ userRole }) {
  const navigate = useNavigate();
  const handleGetStartedClick = () => {
    // Tombol ini akan mengarahkan ke halaman Auth (Login/Register)
    navigate("/auth");
  };

  return (
    <div className="landing-page-full">
      <Header userRole={userRole} />

      <div className="landing-page-hero">
        {/* KIRI: Teks Utama */}
        <div className="hero-text-content-new">
          <h1 className="greeting-text">Hi, Paw Lovers 👋</h1>
          <p className="main-message">
            We get it you don't have enough time for your pet, but you still
            want to make them happy.
            <span className="bold-text"> PawTime</span> is here to connect you
            with reliable care.
          </p>
        </div>

        {/* KANAN: Gambar & Tombol */}
        <div className="hero-image-container-new">
          <img
            src={gambar1}
            alt="Orang berjalan dengan anjing peliharaan"
            className="hero-illustration"
          />
          <button
            className="get-started-button"
            onClick={handleGetStartedClick}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
