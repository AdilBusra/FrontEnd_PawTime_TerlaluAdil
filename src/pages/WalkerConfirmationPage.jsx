// src/pages/WalkerConfirmationPage.jsx (Halaman 13)
import React, { useState } from 'react';
import Header from '../components/Header';

function WalkerConfirmationPage({ navigateTo }) {
    // Data dummy reservasi
    const [reservation, setReservation] = useState({
        owner: 'Maria',
        phone: '085280861000',
        address: 'Medan Denai',
        date: '17 May 2025',
        time: '17:00 PM',
        duration: '1 Hour',
        status: 'pending' // pending, accepted, rejected
    });

    const handleConfirm = (action) => {
        setReservation({ ...reservation, status: action });
        alert(`Reservasi ${action}ed! Pet Owner akan segera diinfokan.`);
        // Setelah konfirmasi, navigasi ke halaman akun walker
        navigateTo('account'); 
    };
    
    // Tampilkan pesan jika sudah dikonfirmasi
    if (reservation.status !== 'pending') {
        return (
             <div className="walker-confirm-page-container">
                <Header navigateTo={navigateTo} />
                <div className="status-page-main" style={{ marginTop: '50px' }}>
                    <h2 className="status-message" style={{ color: '#A3D8A5' }}>
                        Reservasi telah {reservation.status === 'accepted' ? 'Diterima' : 'Ditolak'}!
                    </h2>
                    <p className="status-subtext">Anda akan diarahkan kembali ke Dashboard Akun.</p>
                    <button className="refresh-button" onClick={() => navigateTo('account')}>
                        Kembali ke Akun
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="walker-confirm-page-container">
            <Header navigateTo={navigateTo} />
            
            <div className="walker-confirm-page-main">
                {/* KIRI: Teks Sambutan */}
                <div className="confirm-welcome-text">
                    <h2 className="confirm-heading">
                        Look, there's a new <br />reservation for you 👑
                    </h2>
                    <p className="confirm-subtext">Go with the best choice for yourself</p>
                </div>

                {/* KANAN: Detail Reservasi */}
                <div className="reservation-details-box">
                    <h3 style={{ borderBottom: '1px solid white', paddingBottom: '10px', marginBottom: '20px' }}>Detail Reservasi</h3>
                    
                    <div className="reservation-details-row">
                        <span>Pet Owner</span> <span>: {reservation.owner}</span>
                    </div>
                    <div className="reservation-details-row">
                        <span>Phone</span> <span>: {reservation.phone}</span>
                    </div>
                    <div className="reservation-details-row">
                        <span>Address</span> <span>: {reservation.address}</span>
                    </div>
                    <div className="reservation-details-row">
                        <span>Date</span> <span>: {reservation.date}</span>
                    </div>
                    <div className="reservation-details-row">
                        <span>Time</span> <span>: {reservation.time}</span>
                    </div>
                    <div className="reservation-details-row">
                        <span>Duration</span> <span>: {reservation.duration}</span>
                    </div>

                    <div className="confirm-action-buttons">
                        <button 
                            className="accept-btn"
                            onClick={() => handleConfirm('accepted')}
                        >
                            Accept
                        </button>
                        <button 
                            className="reject-btn"
                            onClick={() => handleConfirm('rejected')}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalkerConfirmationPage;