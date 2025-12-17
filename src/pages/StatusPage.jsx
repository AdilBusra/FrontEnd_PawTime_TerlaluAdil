// src/pages/StatusPage.jsx (Halaman 7 & 8)
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import io from 'socket.io-client';

// Kita gunakan 'isConfirmed' sebagai state untuk beralih antara Halaman 7 dan 8
function StatusPage() {
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get booking ID from navigation state
    const bookingId = location.state?.bookingId || null;
    const walkerName = location.state?.walkerName || "Pet Walker";
    const walkerId = location.state?.walkerId || null;

    // Socket.IO config
    const SOCKET_BASE = import.meta.env.VITE_SOCKET_BASE || import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";
    
    const [bookingStatus, setBookingStatus] = useState('pending');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState(null);

    // Fetch booking status
    const fetchBookingStatus = async () => {
        if (!bookingId) {
            setError('Booking ID tidak ditemukan');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get(`/api/bookings/${bookingId}`);
            const booking = response.data.data || response.data;
            
            console.log('Booking status:', booking);
            
            setBookingData(booking);
            setBookingStatus(booking.status || 'pending');
            setError(null);
        } catch (err) {
            console.error('Error fetching booking status:', err);
            setError('Gagal memuat status booking');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch dan polling setiap 5 detik
    // Also setup Socket.IO listener untuk real-time status updates
    useEffect(() => {
        if (!bookingId) {
            return;
        }

        fetchBookingStatus();
        
        // Setup Socket.IO connection untuk real-time status updates
        try {
            const socket = io(SOCKET_BASE, {
                path: SOCKET_PATH,
                transports: ['websocket'],
                withCredentials: false,
                auth: {
                    token: localStorage.getItem('token')
                }
            });

            socket.on('connect', () => {
                console.log('✅ Connected to Socket.io for real-time status');
                // Join booking room untuk listen status changes
                socket.emit('join_room', { bookingId });
                console.log(`🚪 Joined room: booking-${bookingId}`);
            });

            // Listen untuk real-time status changes dari walker
            socket.on('booking_status_changed', (data) => {
                console.log('📊 Booking status changed (real-time):', data);
                if (data?.status) {
                    setBookingStatus(data.status);
                    setBookingData(prev => ({
                        ...prev,
                        status: data.status,
                        updated_at: data.timestamp || new Date().toISOString()
                    }));
                    setIsLoading(false);
                }
            });

            socket.on('disconnect', () => {
                console.log('❌ Disconnected from Socket.io');
            });

            // Fallback: Poll setiap 5 detik jika status masih pending (backup mechanism)
            const interval = setInterval(() => {
                if (bookingStatus === 'pending') {
                    console.log('⏱️ Polling status (fallback)...');
                    fetchBookingStatus();
                }
            }, 5000);

            return () => {
                clearInterval(interval);
                socket.disconnect();
            };
        } catch (error) {
            console.error('Socket.io connection error:', error);
            
            // Fallback ke polling jika Socket.IO gagal
            const interval = setInterval(() => {
                if (bookingStatus === 'pending') {
                    fetchBookingStatus();
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [bookingId, bookingStatus, SOCKET_BASE, SOCKET_PATH]);

    const handleRefresh = () => {
        setIsLoading(true);
        fetchBookingStatus();
    };

    // Error state
    if (error && !bookingId) {
        return (
            <div className="waiting-page-container">
                <Header/>
                <div className="status-page-main">
                    <h2 className="status-message" style={{ color: '#ff6b6b' }}>{error}</h2>
                    <p className="status-subtext">Silakan kembali dan coba booking lagi.</p>
                    <button 
                        className="refresh-button"
                        onClick={() => navigate('/walkers')}
                    >
                        Kembali ke Daftar Walker
                    </button>
                </div>
            </div>
        );
    }
    
    // Simulasi Walker Confirmation (Halaman 7) - Pending Status
    if (bookingStatus === 'pending') {
        return (
            <div className="waiting-page-container">
                <Header/>
                <div className="status-page-main">
                    <span className="waiting-icon">⏰</span>
                    <h2 className="status-message">Waiting The Pet Walker to confirmed your booking...</h2>
                    <p className="status-subtext">Mohon tunggu sebentar, Walker sedang memproses permintaan Anda.</p>
                    <p className="status-subtext" style={{ fontSize: '12px', marginTop: '10px' }}>
                        (Auto-refresh setiap 5 detik)
                    </p>
                    <button 
                        className="refresh-button"
                        onClick={handleRefresh}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Memuat...' : 'Refresh Sekarang'}
                    </button>
                </div>
            </div>
        );
    }

    // Rejected Status
    if (bookingStatus === 'rejected') {
        return (
            <div className="waiting-page-container">
                <Header/>
                <div className="status-page-main">
                    <h2 className="status-message" style={{ color: '#ff6b6b' }}>Booking Ditolak 😢</h2>
                    <p className="status-subtext">Maaf, Walker tidak dapat menerima booking Anda saat ini.</p>
                    <p className="status-subtext">Silakan coba walker lain atau waktu yang berbeda.</p>
                    <button 
                        className="refresh-button"
                        onClick={() => navigate('/walkers')}
                    >
                        Cari Walker Lain
                    </button>
                </div>
            </div>
        );
    }
    
    // Confirmed Booking (Halaman 8) - Accepted Status
    return (
        <div className="confirmed-page-container">
            <Header/>
            <div className="status-page-main">
                <h2 className="status-message" style={{ color: '#4A70A9' }}>Your Booking is Confirmed!!! 🎉</h2>
                <p className="status-subtext" style={{ color: '#4A70A9' }}>The Walker will reach out soon to confirm the details. Keep an eye on your inbox and phone</p>
                
                <h3 style={{ color: '#4A69BB', margin: '30px 0 20px' }}>Other Details:</h3>
                
                <div className="confirmed-actions">
                    <button 
                        className="action-button primary" 
                        onClick={() => navigate('/tracking', { 
                            state: { bookingId, walkerName, walkerId } 
                        })}
                    >
                        Tracking
                    </button>
                    <button 
                        className="action-button secondary" 
                        onClick={() => navigate('/qr/payment', { 
                            state: { bookingId, totalPrice: bookingData?.total_price } 
                        })}
                    >
                        Payment
                    </button>
                    <button 
                        className="action-button secondary" 
                        onClick={() => navigate('/rating', { 
                            state: { bookingId, walkerName, walkerId } 
                        })}
                    >
                        Rating
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StatusPage;