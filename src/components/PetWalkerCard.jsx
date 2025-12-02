// src/components/PetWalkerCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import aset lokal dari folder assets dengan URL import
import img1Url from '../assets/download(6).jpeg?url';
import img2Url from '../assets/download(7).jpeg?url';
import img3Url from '../assets/download(8).jpeg?url';
import img4Url from '../assets/download(9).jpeg?url';
import img5Url from '../assets/download(10).jpeg?url';
import img6Url from '../assets/download(11).jpeg?url';

// Masukkan URL ke dalam array untuk fallback
const backupImages = [img1Url, img2Url, img3Url, img4Url, img5Url, img6Url];

// Tidak lagi menerima prop navigateTo
function PetWalkerCard({ id, name, location, image }) {
    
    const navigate = useNavigate(); // Panggil Hook
    
    // Fungsi untuk mendapatkan index konsisten dari id (mendukung string/UUID)
    const getIndexFromId = () => {
        try {
            // Jika id adalah number yang valid
            const n = Number(id);
            if (!Number.isNaN(n) && Number.isFinite(n)) {
                return Math.abs(n) % backupImages.length;
            }
            // Jika id adalah string/UUID, hash menjadi angka deterministik
            const s = String(id ?? "");
            let hash = 0;
            for (let i = 0; i < s.length; i++) {
                hash = (hash * 31 + s.charCodeAt(i)) | 0; // 32-bit int
            }
            return Math.abs(hash) % backupImages.length;
        } catch {
            return 0;
        }
    };

    // Pilih gambar fallback yang konsisten berdasarkan ID apapun bentuknya
    const getConsistentImage = () => backupImages[getIndexFromId()] || backupImages[0];
    
    // State untuk menyimpan image source yang aktif
    // Jika dari database ada, gunakan itu. Jika tidak, gunakan fallback konsisten
    const [imgSrc, setImgSrc] = useState(image || getConsistentImage());
    
    // Fungsi untuk mengarahkan ke halaman detail (meneruskan ID walker)
    const handleViewMore = () => {
        // Navigasi menggunakan path URL yang sudah didefinisikan di App.jsx
        navigate(`/walker/${id}`); 
    }

    // Handler jika gambar gagal load
    const handleImageError = () => {
        // Gunakan consistent fallback image lokal berdasarkan ID
        setImgSrc(getConsistentImage());
    };

    // Ensure location is always a string
    const locationText = typeof location === 'string' ? location : String(location || 'Location Unknown');

    return (
        <div className="pet-walker-card">
            <img 
                src={imgSrc} 
                alt={name} 
                className="walker-image"
                onError={handleImageError}
            />
            <div className="walker-details">
                <h3 className="walker-name">{name}</h3>
                <p className="walker-location">📍 {locationText}</p>
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