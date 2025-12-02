// src/pages/WalkerDetailPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

// Komponen Pembantu untuk menampilkan Rating Bintang
const RatingStars = ({ rating }) => {
  const stars = [];
  const ratingNum = rating || 0;
  for (let i = 0; i < 5; i++) {
    const starClass = i < ratingNum ? 'filled' : 'empty'; 
    stars.push(
      <span key={i} className={`star ${starClass}`}>
        ★
      </span>
    );
  }
  return <div className="rating-stars">{stars}</div>;
};

// Komponen Utama Detail Page
function WalkerDetailPage({ userRole }) {
  
  const { id } = useParams();
  const navigate = useNavigate();

  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch walker detail dari backend
  useEffect(() => {
    const fetchWalkerDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/walkers/${id}`);
        
        console.log('Walker detail:', response.data);
        
        const walkerData = response.data.data || response.data;
        setWalker(walkerData);
        setError(null);
      } catch (err) {
        console.error('Error fetching walker detail:', err);
        setError('Gagal memuat detail walker');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWalkerDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="walker-detail-page-container">
        <Header userRole={userRole} />
        <div className="p-10 text-center">
          <h2>Loading walker details...</h2>
        </div>
      </div>
    );
  }

  if (error || !walker) {
    return (
      <div className="walker-detail-page-container">
        <Header userRole={userRole} />
        <div className="p-10 text-center text-red-500">
          <h2>{error || 'Data Walker Tidak Ditemukan.'}</h2>
          <button className="view-more-button" onClick={() => navigate(-1)}>Kembali ke Daftar</button>
        </div>
      </div>
    );
  }
  
  const name = walker.name || walker.user?.name || 'Unknown Walker';
  const location = walker.location_name || walker.location || 'Unknown Location';
  const image = walker.photo_url || 'https://via.placeholder.com/150';
  const description = walker.bio || 'No description available';
  const fee = walker.hourly_rate ? `Rp ${walker.hourly_rate.toLocaleString('id-ID')}` : 'Price not set';
  const rating = walker.average_rating || 0;

  // HANDLER UNTUK TOMBOL BOOK NOW (Mengarah ke /booking)
  const handleBookNow = () => {
      navigate('/booking', { 
        state: { 
          walkerId: walker.id || walker.user_id,
          walkerName: name,
          pricePerHour: walker.hourly_rate || 50000
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