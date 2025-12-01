// src/components/PetWalkerCard.jsx (SETELAH PERUBAHAN)
import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- BARU

// Tidak lagi menerima prop navigateTo
function PetWalkerCard({ id, name, location, image }) {
    
    const navigate = useNavigate(); // <-- Panggil Hook
    
    // Fungsi untuk mengarahkan ke halaman detail (meneruskan ID walker)
    const handleViewMore = () => {
        // Navigasi menggunakan path URL yang sudah didefinisikan di App.jsx
        navigate(`/walker/${id}`); 
    }

    return (
        <div className="pet-walker-card">
            <img src={image} alt={name} className="walker-image" />
            <div className="walker-details">
                <h3 className="walker-name">{name}</h3>
                <p className="walker-location">📍 {location}</p>
                <button 
                    className="view-more-button"
                    onClick={handleViewMore}
                >
                    view more
                </button>
            </div>
        </div>
    );
}

export default PetWalkerCard;