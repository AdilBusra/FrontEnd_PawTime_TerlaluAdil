// src/pages/StatusPage.jsx (Halaman 7 & 8)
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

// Kita gunakan 'isConfirmed' sebagai state untuk beralih antara Halaman 7 dan 8
function StatusPage({ navigateTo }) { 
    // State ini akan disimulasikan sebagai respons dari backend Walker
    const [isConfirmed, setIsConfirmed] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);

    // Simulasi proses menunggu konfirmasi
    useEffect(() => {
        // Simulasi menunggu 3 detik, lalu konfirmasi
        const timer = setTimeout(() => {
            setIsLoading(false);
            // Anda bisa set isConfirmed(true) jika ingin langsung loncat ke Halaman 8
            // Untuk demo, kita biarkan false, dan user harus klik refresh
        }, 3000); 

        return () => clearTimeout(timer);
    }, []);

    const handleRefresh = () => {
        if (!isConfirmed) {
            alert("Mengecek konfirmasi... (Simulasi: Konfirmasi Diterima)");
            setIsConfirmed(true); // Ganti status setelah refresh
        }
    };
    
    // Simulasi Walker Confirmation (Halaman 7)
    if (!isConfirmed) {
        return (
            <div className="waiting-page-container">
                <Header navigateTo={navigateTo} />
                <div className="status-page-main">
                    <span className="waiting-icon">⏰</span> {/* Ikon Jam (Halaman 7) */}
                    <h2 className="status-message">Waiting The Pet Walker to confirmed your booking...</h2>
                    <p className="status-subtext">Mohon tunggu sebentar, Walker sedang memproses permintaan Anda.</p>
                    <button 
                        className="refresh-button"
                        onClick={handleRefresh}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Memuat...' : 'Refresh'}
                    </button>
                </div>
            </div>
        );
    }
    
    // Confirmed Booking (Halaman 8)
    return (
        <div className="confirmed-page-container">
            <Header navigateTo={navigateTo} />
            <div className="status-page-main">
                <h2 className="status-message" style={{ color: '#A3D8A5' }}>Your Booking is Confirmed!!! 🎉</h2>
                <p className="status-subtext">The Walker will reach out soon to confirm the details. Keep an eye on your inbox and phone</p>
                
                <h3 style={{ color: '#4A69BB', margin: '30px 0 20px' }}>Other Details:</h3>
                
                <div className="confirmed-actions">
                    <button 
                        className="action-button primary" 
                        onClick={() => navigateTo('tracking')} // Halaman 9
                    >
                        Tracking
                    </button>
                    <button 
                        className="action-button secondary" 
                        onClick={() => navigateTo('payment')} // Halaman 10
                    >
                        Payment
                    </button>
                    <button 
                        className="action-button secondary" 
                        onClick={() => navigateTo('rating')} // Halaman 11
                    >
                        Rating
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StatusPage;