// src/components/PetWalkerCard.jsx
import React from 'react';

// Menerima props: name, location, image, dan navigateTo
function PetWalkerCard({ id, name, location, image, navigateTo }) {
    
    // Fungsi untuk mengarahkan ke halaman detail (meneruskan ID walker)
    const handleViewMore = () => {
        // Penting: kita kirim ID ke fungsi navigateTo agar halaman detail tahu data mana yang harus ditampilkan
        navigateTo('detail', id); 
    }

    return (
        <div className="pet-walker-card">
            <img src={image} alt={name} className="walker-image" />
            <div className="walker-details">
                <h3 className="walker-name">{name}</h3>
                <p className="walker-location">📍 {location}</p>
                <button 
                    className="view-more-button"
                    onClick={handleViewMore} // <-- Panggil fungsi navigasi
                >
                    view more
                </button>
            </div>
        </div>
    );
}

export default PetWalkerCard;