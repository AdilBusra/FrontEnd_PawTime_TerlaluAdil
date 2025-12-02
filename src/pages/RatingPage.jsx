// src/pages/RatingPage.jsx (Halaman 11)
import React, { useState } from 'react';
import Header from '../components/Header';
import chris from '../assets/download(9).jpeg'; // Ambil gambar Christella dari mockData
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

function RatingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get booking data from navigation state
    const bookingId = location.state?.bookingId || null;
    const walkerName = location.state?.walkerName || "Pet Walker";
    const walkerId = location.state?.walkerId || null;
    
    const [rating, setRating] = useState(0); // State untuk bintang
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingClick = (newRating) => {
        setRating(newRating);
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            alert("Mohon berikan rating bintang terlebih dahulu.");
            return;
        }

        if (!bookingId) {
            alert("Booking ID tidak ditemukan. Silakan coba lagi dari halaman booking.");
            return;
        }

        try {
            setIsSubmitting(true);
            
            const payload = {
                booking_id: bookingId,
                walker_id: walkerId,
                rating: rating,
                review: review.trim() || null
            };

            console.log('Submitting rating:', payload);

            const response = await api.post('/api/ratings', payload);
            
            console.log('Rating submitted:', response.data);
            alert(`Terima kasih atas rating dan ulasannya untuk ${walkerName}!`);
            
            // Arahkan kembali ke halaman beranda atau akun
            navigate('/');
        } catch (error) {
            console.error('Error submitting rating:', error);
            const errorMessage = error.response?.data?.message || 'Gagal mengirim rating. Silakan coba lagi.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fungsi untuk merender bintang
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span 
                    key={i} 
                    className={`star-input ${i <= rating ? 'active' : ''}`}
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
            <Header/>
            
            <form onSubmit={handleSubmitRating} className="rating-page-main">
                <h2 style={{ color: '#EFECE3', marginBottom: '30px' }}>Bagaimana layanan Pet Walker? ⭐️</h2>
                
                <div className="rating-content">
                    
                    {/* KIRI: Foto Profil Walker */}
                    <div className="rating-profile-box">
                        <img src={chris} alt={walkerName} />
                        <h3 style={{ color: 'white', margin: '0 0 5px' }}>{walkerName}</h3>
                        <p style={{ fontSize: '14px' }}>Papua</p>
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
                            <div className="rating-stars-input">
                                {renderStars()}
                            </div>
                        </div>

                        <button type="submit" className="rating-confirm-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Mengirim...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RatingPage;