// src/pages/WalkerDetailPage.jsx
import React from 'react';
import Header from '../components/Header';
import { petWalkers } from '../data/mockData'; 

// Komponen Pembantu untuk menampilkan Rating Bintang
const RatingStars = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const starClass = i < rating ? 'filled' : 'empty'; 
    stars.push(
      <span key={i} className={`star ${starClass}`}>
        ★
      </span>
    );
  }
  return <div className="rating-stars">{stars}</div>;
};

// Komponen Utama Detail Page, menerima walkerId
function WalkerDetailPage({ navigateTo, walkerId }) { 
  
  // 1. CARI DATA WALKER BERDASARKAN ID
  const walker = petWalkers.find(w => w.id == walkerId); 

  if (!walker) {
    return (
      <div className="walker-detail-page-container">
        <Header navigateTo={navigateTo} />
        <div className="p-10 text-center text-red-500">
          <h2>Data Walker Tidak Ditemukan.</h2>
          <button className="view-more-button" onClick={() => navigateTo('walker')}>Kembali ke Daftar</button>
        </div>
      </div>
    );
  }
  
  const { name, location, image, description, fee, rating } = walker;

  // HANDLER UNTUK TOMBOL BOOK NOW (Mengarah ke Halaman 6: Booking)
  const handleBookNow = () => {
      // Kita kirim ID walker dan namanya ke halaman booking
      navigateTo('booking', { walkerId: walker.id, walkerName: walker.name });
  };

  return (
    <div className="walker-detail-page-container">
      <Header navigateTo={navigateTo} />

      <div className="walker-detail-box">
        
        <div className="detail-content">
          
          {/* KIRI: Foto & Info Dasar */}
          <div className="walker-info-box">
            <img src={image} alt={name} className="detail-image" />
            <h3 className="detail-name">{name}</h3>
            <p className="detail-location">📍 {location}</p>
          </div>
          
          {/* KANAN: Deskripsi & Data Tambahan */}
          <div className="walker-meta">
            
            <div className="meta-row">
              <span className="meta-label">Description</span>
              <span className="meta-separator">:</span>
              <p className="meta-value description-text">{description}</p>
            </div>
            
            <div className="meta-row">
              <span className="meta-label">Fee / Hour</span>
              <span className="meta-separator">:</span>
              <span className="meta-value fee-text">{fee}</span>
            </div>
            
            <div className="meta-row">
              <span className="meta-label">Rating</span>
              <span className="meta-separator">:</span>
              <span className="meta-value">
                <RatingStars rating={rating} />
              </span>
            </div>
            
            <button 
              className="book-now-button"
              onClick={handleBookNow} // <-- NAVIGASI KE BOOKING
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalkerDetailPage;