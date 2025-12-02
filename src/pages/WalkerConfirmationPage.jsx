// src/pages/WalkerConfirmationPage.jsx (Halaman 13)
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function WalkerConfirmationPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    // Fetch pending bookings untuk walker ini
    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                setLoading(true);
                // Fetch bookings yang pending untuk walker ini
                const response = await api.get('/api/bookings/walker/pending');
                
                console.log('Pending bookings:', response.data);
                
                // Extract array dari response
                let bookingsArray = [];
                if (response.data.data && Array.isArray(response.data.data)) {
                    bookingsArray = response.data.data;
                } else if (Array.isArray(response.data)) {
                    bookingsArray = response.data;
                }
                
                setBookings(bookingsArray);
                setError(null);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Gagal memuat booking. Silakan coba lagi.');
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingBookings();
    }, []);

    const handleConfirm = async (bookingId, action) => {
        try {
            setProcessingId(bookingId);
            
            // Send confirmation to backend
            const response = await api.patch(`/api/bookings/${bookingId}/status`, {
                status: action // 'accepted' atau 'rejected'
            });

            console.log('Booking updated:', response.data);
            alert(`Reservasi ${action === 'accepted' ? 'diterima' : 'ditolak'}! Pet Owner akan segera diinfokan.`);
            
            // Remove booking dari list setelah konfirmasi
            setBookings(prev => prev.filter(b => b.id !== bookingId));
            
        } catch (error) {
            console.error('Error updating booking:', error);
            const errorMessage = error.response?.data?.message || 'Gagal mengupdate booking. Silakan coba lagi.';
            alert(errorMessage);
        } finally {
            setProcessingId(null);
        }
    };

    // Format date dan time
    const formatDateTime = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="walker-confirm-page-container">
                <Header/>
                <div className="status-page-main" style={{ marginTop: '50px' }}>
                    <h2 className="status-message">Loading bookings...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="walker-confirm-page-container">
                <Header/>
                <div className="status-page-main" style={{ marginTop: '50px' }}>
                    <h2 className="status-message" style={{ color: '#ff6b6b' }}>{error}</h2>
                    <button className="refresh-button" onClick={() => window.location.reload()}>
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="walker-confirm-page-container">
                <Header/>
                <div className="status-page-main" style={{ marginTop: '50px' }}>
                    <h2 className="status-message">Tidak ada booking pending saat ini 🎉</h2>
                    <p className="status-subtext">Semua booking sudah dikonfirmasi.</p>
                    <button className="refresh-button" onClick={() => navigate('/account')}>
                        Kembali ke Akun
                    </button>
                </div>
            </div>
        );
    }

    // Render multiple bookings
    return (
        <div className="walker-confirm-page-container">
            <Header/>
            
            <div className="walker-confirm-page-main">
                {/* KIRI: Teks Sambutan */}
                <div className="confirm-welcome-text">
                    <h2 className="confirm-heading">
                        Look, there's {bookings.length} new <br />reservation{bookings.length > 1 ? 's' : ''} for you 👑
                    </h2>
                    <p className="confirm-subtext">Go with the best choice for yourself</p>
                </div>

                {/* KANAN: Detail Reservasi - Loop semua bookings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                    {bookings.map((booking) => (
                        <div key={booking.id} className="reservation-details-box">
                            <h3 style={{ borderBottom: '1px solid white', paddingBottom: '10px', marginBottom: '20px' }}>
                                Detail Reservasi #{booking.id}
                            </h3>
                            
                            <div className="reservation-details-row">
                                <span>Pet Owner</span> 
                                <span>: {booking.owner?.name || booking.owner_name || 'Unknown'}</span>
                            </div>
                            <div className="reservation-details-row">
                                <span>Phone</span> 
                                <span>: {booking.owner?.phone || booking.owner_phone || '-'}</span>
                            </div>
                            <div className="reservation-details-row">
                                <span>Address</span> 
                                <span>: {booking.owner?.address || booking.owner_address || '-'}</span>
                            </div>
                            <div className="reservation-details-row">
                                <span>Date & Time</span> 
                                <span>: {formatDateTime(booking.start_time)}</span>
                            </div>
                            <div className="reservation-details-row">
                                <span>Duration</span> 
                                <span>: {booking.duration || 1} Hour{booking.duration > 1 ? 's' : ''}</span>
                            </div>
                            <div className="reservation-details-row">
                                <span>Total Price</span> 
                                <span>: Rp {booking.total_price?.toLocaleString('id-ID') || '0'}</span>
                            </div>

                            <div className="confirm-action-buttons">
                                <button 
                                    className="accept-btn"
                                    onClick={() => handleConfirm(booking.id, 'accepted')}
                                    disabled={processingId === booking.id}
                                >
                                    {processingId === booking.id ? 'Processing...' : 'Accept'}
                                </button>
                                <button 
                                    className="reject-btn"
                                    onClick={() => handleConfirm(booking.id, 'rejected')}
                                    disabled={processingId === booking.id}
                                >
                                    {processingId === booking.id ? 'Processing...' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WalkerConfirmationPage;