// src/pages/WalkerDetailPage.jsx
import React from 'react';
import Header from '../components/Header';
import { petWalkers } from '../data/mockData'; 
import { useParams, useNavigate } from 'react-router-dom';

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

// Komponen Utama Detail Page
function WalkerDetailPage({ userRole }) { // HILANGKAN navigateTo dan walkerId
  
  const { id } = useParams(); // <-- AMBIL ID DARI URL (:id)
  const navigate = useNavigate(); // <-- PANGGIL HOOK

  // 1. CARI DATA WALKER BERDASARKAN ID
  // ID yang didapat dari useParams adalah string
  const walker = petWalkers.find(w => w.id == id); 

  if (!walker) {
    return (
      <div className="walker-detail-page-container">
        <Header userRole={userRole} /> {/* HAPUS prop navigateTo */}
        <div className="p-10 text-center text-red-500">
          <h2>Data Walker Tidak Ditemukan.</h2>
          {/* Menggunakan navigate(-1) untuk kembali ke halaman sebelumnya */}
          <button className="view-more-button" onClick={() => navigate(-1)}>Kembali ke Daftar</button>
        </div>
      </div>
    );
  }
  
  const { name, location, image, description, fee, rating } = walker;

  // HANDLER UNTUK TOMBOL BOOK NOW (Mengarah ke /booking)
  const handleBookNow = () => {
      // Navigasi dan Meneruskan DATA melalui state
      navigate('/booking', { 
        state: { 
          walkerId: walker.id, 
          walkerName: walker.name 
        } 
      });
  };

  return (
    <div className="walker-detail-page-container">
   <Header userRole={userRole} />

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