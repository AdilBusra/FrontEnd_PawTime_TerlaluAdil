// src/pages/WalkerTrackingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Header from '../components/Header';

// Socket base & path (polling-first) sesuai integrasi FE↔BE
const SOCKET_BASE = import.meta.env.VITE_SOCKET_BASE || import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";

function WalkerTrackingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const watchIdRef = useRef(null);
    const intervalRef = useRef(null);
    const lastSentAtRef = useRef(0);
    const lastPositionRef = useRef(null);

    // Simple distance calculator (Haversine) in meters
    const distanceInMeters = (lat1, lon1, lat2, lon2) => {
        const toRad = (v) => (v * Math.PI) / 180;
        const R = 6371000; // Earth radius in meters
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : undefined;
    const currentUser = typeof window !== 'undefined' ? (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })() : null;
    const walkerId = currentUser?.id || currentUser?.user_id || null; // gunakan ID user sebagai walkerId
    
    // Get booking data from navigation state
    const bookingId = location.state?.bookingId || null;
    const ownerName = location.state?.ownerName || 'Pet Owner';
    
    const [isTracking, setIsTracking] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [status, setStatus] = useState('Belum mulai tracking');
    const [locationCount, setLocationCount] = useState(0);
    const [error, setError] = useState(null);

    // Initialize socket connection
    useEffect(() => {
        if (!bookingId) {
            setError('Booking ID tidak ditemukan');
            return;
        }

        console.log('🚀 Connecting to Socket.io...');
            const newSocket = io(SOCKET_BASE, {
                path: SOCKET_PATH,
                // Prefer pure WebSocket to avoid credentialed XHR polling CORS issues
                transports: ['websocket'],
                transportOptions: {
                    polling: {
                        withCredentials: false,
                    },
                },
                withCredentials: false,
                auth: token ? { token } : undefined,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });

        socketRef.current = newSocket;

        newSocket.on('connect', () => {
            console.log('✅ Connected to server');
            setIsConnected(true);
            // Join room pakai payload object agar kompatibel
            newSocket.emit('join_room', { booking_id: bookingId });
            console.log(`🚪 Joined room: booking-${bookingId}`);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected');
            setIsConnected(false);
        });

        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            newSocket.disconnect();
        };
    }, [bookingId]);

    // Start tracking
    const startTracking = () => {
        if (!navigator.geolocation) {
            setError('Geolocation tidak didukung di browser ini');
            return;
        }

        setStatus('Memulai tracking...');
        
        // Emit tracking started event
        if (socketRef.current) {
            socketRef.current.emit('tracking_started', {
                bookingId: bookingId,
                timestamp: new Date().toISOString()
            });
        }

        // Watch position with high accuracy
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const locationData = {
                    bookingId: bookingId,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    walkerId: walkerId,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date(position.timestamp).toISOString()
                };

                console.log('📍 Sending location:', locationData);

                // Update local state
                setCurrentPosition(locationData);
                setLocationCount(prev => prev + 1);
                setStatus('Tracking aktif - Lokasi dikirim');
                setError(null);

                // Throttle immediate emits to at most once per 30s
                const now = Date.now();
                const lastPos = lastPositionRef.current;
                const movedEnough = lastPos
                    ? distanceInMeters(lastPos.latitude, lastPos.longitude, locationData.latitude, locationData.longitude) >= 10
                    : true; // if no lastPos, treat as moved
                if (now - lastSentAtRef.current >= 30000 && movedEnough) {
                    if (socketRef.current && socketRef.current.connected) {
                        socketRef.current.emit('live_location', locationData);
                        lastSentAtRef.current = now;
                        lastPositionRef.current = { latitude: locationData.latitude, longitude: locationData.longitude };
                    }
                }
            },
            (error) => {
                console.error('❌ Geolocation error:', error);
                let errorMsg = 'Error mendapatkan lokasi';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Permission ditolak. Aktifkan lokasi di browser.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Posisi tidak tersedia.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Request timeout.';
                        break;
                }
                
                setError(errorMsg);
                setStatus('Error tracking');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        // Also emit every 30s using the latest known position for consistency
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            if (!socketRef.current || !socketRef.current.connected) return;
            if (!currentPosition) return;
            // Skip if moved < 10m compared to last sent
            const lastPos = lastPositionRef.current;
            const movedEnough = lastPos
                ? distanceInMeters(lastPos.latitude, lastPos.longitude, currentPosition.latitude, currentPosition.longitude) >= 10
                : true;
            if (!movedEnough) {
                return;
            }
            socketRef.current.emit('live_location', currentPosition);
            lastSentAtRef.current = Date.now();
            lastPositionRef.current = { latitude: currentPosition.latitude, longitude: currentPosition.longitude };
            console.log('⏱️ Periodic emit (30s):', currentPosition);
        }, 30000);

        setIsTracking(true);
    };

    // Stop tracking
    const stopTracking = () => {
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Emit tracking stopped event
        if (socketRef.current) {
            socketRef.current.emit('tracking_stopped', {
                bookingId: bookingId,
                timestamp: new Date().toISOString()
            });
        }

        setIsTracking(false);
        setStatus('Tracking dihentikan');
        setLocationCount(0);
    };

    const handleFinishWalking = () => {
        if (isTracking) {
            stopTracking();
        }
        
        // Navigate to completion or payment page
        navigate('/account');
    };

    return (
        <div className="walker-tracking-page-container">
            <Header />
            
            <div className="walker-tracking-main" style={{ 
                maxWidth: '600px', 
                margin: '40px auto', 
                padding: '20px' 
            }}>
                <h2 style={{ textAlign: 'center', color: '#4A69BB', marginBottom: '30px' }}>
                    🐕 Walker Tracking Control
                </h2>

                {error && (
                    <div style={{
                        padding: '15px',
                        background: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        color: '#721c24'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Connection Status */}
                <div style={{
                    padding: '15px',
                    background: isConnected ? '#d4edda' : '#f8d7da',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '24px' }}>
                        {isConnected ? '🟢' : '🔴'}
                    </span>
                    <div>
                        <strong>{isConnected ? 'Terhubung ke Server' : 'Tidak Terhubung'}</strong>
                        <p style={{ margin: 0, fontSize: '12px' }}>{status}</p>
                    </div>
                </div>

                {/* Booking Info */}
                <div style={{
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <p style={{ margin: '0 0 10px 0' }}>
                        <strong>📱 Booking ID:</strong> {bookingId || 'N/A'}
                    </p>
                    <p style={{ margin: '0 0 10px 0' }}>
                        <strong>👤 Pet Owner:</strong> {ownerName}
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>📍 Lokasi Terkirim:</strong> {locationCount} kali
                    </p>
                </div>

                {/* Current Position Info */}
                {currentPosition && (
                    <div style={{
                        padding: '15px',
                        background: '#e7f3ff',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        <p style={{ margin: '0 0 5px 0' }}>
                            <strong>Lat:</strong> {currentPosition.latitude.toFixed(6)}
                        </p>
                        <p style={{ margin: '0 0 5px 0' }}>
                            <strong>Lng:</strong> {currentPosition.longitude.toFixed(6)}
                        </p>
                        <p style={{ margin: 0 }}>
                            <strong>Akurasi:</strong> ±{currentPosition.accuracy.toFixed(0)}m
                        </p>
                    </div>
                )}

                {/* Control Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!isTracking ? (
                        <button
                            onClick={startTracking}
                            disabled={!isConnected || !bookingId}
                            style={{
                                padding: '15px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: isConnected && bookingId ? 'pointer' : 'not-allowed',
                                opacity: isConnected && bookingId ? 1 : 0.5
                            }}
                        >
                            🚀 Start Tracking
                        </button>
                    ) : (
                        <button
                            onClick={stopTracking}
                            style={{
                                padding: '15px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            ⏸️ Stop Tracking
                        </button>
                    )}

                    <button
                        onClick={handleFinishWalking}
                        style={{
                            padding: '15px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            background: '#4A69BB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        ✅ Selesai & Kembali
                    </button>
                </div>

                {/* Instructions */}
                <div style={{
                    marginTop: '30px',
                    padding: '15px',
                    background: '#fff3cd',
                    borderRadius: '8px',
                    fontSize: '14px'
                }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                        📋 Instruksi:
                    </p>
                    <ol style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Pastikan GPS/Lokasi aktif di HP</li>
                        <li>Izinkan akses lokasi di browser</li>
                        <li>Klik "Start Tracking" saat mulai jalan</li>
                        <li>Owner akan melihat posisi Anda real-time</li>
                        <li>Klik "Stop" jika berhenti sementara</li>
                        <li>Klik "Selesai" setelah walking selesai</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default WalkerTrackingPage;
