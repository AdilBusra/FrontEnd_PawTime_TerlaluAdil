// src/pages/TrackingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';

// --- FIX ICON LEAFLET (Wajib ada biar icon muncul) ---
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon untuk Walker (lebih besar dan berbeda warna)
const walkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to update map center when position changes
function MapUpdater({ position, isFirstLocation, onZoomComplete }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            // Jika pertama kali menerima lokasi, zoom lebih dekat
            if (isFirstLocation) {
                map.setView(position, 16, {
                    animate: true,
                    duration: 1.5 // Animasi smooth 1.5 detik
                });
                // Tandai bahwa initial zoom sudah selesai
                setTimeout(() => {
                    if (onZoomComplete) onZoomComplete();
                }, 1500);
            } else {
                // Update posisi tanpa mengubah zoom level
                map.setView(position, map.getZoom(), {
                    animate: true,
                    duration: 0.5
                });
            }
        }
    }, [position, isFirstLocation, map, onZoomComplete]);
    return null;
}

// --- KONFIGURASI SOCKET (sesuai FRONTEND_REQUIREMENTS_FULL.md) ---
const SOCKET_BASE = import.meta.env.VITE_SOCKET_BASE || import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";

function TrackingPage() {
    const location = useLocation();
    const socketRef = useRef(null);
    
    // Get booking ID from navigation state
    const bookingId = location.state?.bookingId || 'demo-booking';
    const walkerName = location.state?.walkerName || 'Pet Walker';
    
    const [position, setPosition] = useState(null);
    const [status, setStatus] = useState("Menunggu koneksi ke server...");
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [hasInitialZoom, setHasInitialZoom] = useState(false); // Track apakah sudah zoom pertama kali

    useEffect(() => {
        console.log('🚀 Initializing Socket.io connection...');
    console.log('📍 Socket URL:', SOCKET_BASE);
        console.log('🎫 Booking ID:', bookingId);
        
        // Initialize socket connection (polling fallback, path, auth)
        const token = localStorage.getItem('token');
        const newSocket = io(SOCKET_BASE, { 
            path: SOCKET_PATH,
            // Prefer pure WebSocket to avoid XHR polling CORS issues
            transports: ['websocket'],
            // Ensure polling (if ever used) does NOT send credentials
            transportOptions: {
                polling: {
                    withCredentials: false
                }
            },
            // Do not include credentials automatically; we pass token via auth instead
            withCredentials: false,
            auth: token ? { token } : undefined,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });
        
        socketRef.current = newSocket;
        
        // Connection handlers
        newSocket.on('connect', () => {
            console.log("✅ Connected to Socket Server");
            setIsConnected(true);
            setStatus("Terhubung. Menunggu Walker memulai tracking...");
            
            // Join room based on booking ID
            // Join room menggunakan payload object agar kompatibel
            newSocket.emit('join_room', { booking_id: bookingId });
            console.log(`🚪 Joined room: booking-${bookingId}`);
        });

        newSocket.on('disconnect', () => {
            console.log("❌ Disconnected from Socket Server");
            setIsConnected(false);
            setStatus("Koneksi terputus. Mencoba reconnect...");
        });

        newSocket.on('connect_error', (error) => {
            console.error("❌ Connection Error:", error.message);
            setStatus("Gagal terhubung ke server. Cek koneksi internet.");
        });

        // Listen for location updates (owner)
        newSocket.on('live_location', (data) => {
            console.log("📍 Lokasi Diterima:", data);
            
            if (data.latitude && data.longitude) {
                const newPosition = [data.latitude, data.longitude];
                setPosition(newPosition);
                setStatus(`${walkerName} sedang bergerak 🏃`);
                setLastUpdate(new Date(data.timestamp || Date.now()));
                
                // Log jika ini lokasi pertama
                if (!hasInitialZoom) {
                    console.log("🎯 Preparing to auto-zoom to Walker location");
                }
            }
        });

        // Optional: also support snake_case event name if backend emits it
        newSocket.on('update_location', (data) => {
            console.log("📍 Lokasi (snake_case) Diterima:", data);
            const lat = data.latitude;
            const lng = data.longitude;
            if (lat != null && lng != null) {
                const newPosition = [lat, lng];
                setPosition(newPosition);
                setStatus(`${walkerName} sedang bergerak 🏃`);
                setLastUpdate(new Date(data.timestamp || Date.now()));
                if (!hasInitialZoom) console.log("🎯 Preparing to auto-zoom to Walker location (snake_case)");
            }
        });

        // Listen for tracking started event
        newSocket.on('tracking_started', (data) => {
            console.log("🎬 Tracking Started:", data);
            setStatus(`${walkerName} mulai tracking!`);
        });

        // Listen for tracking stopped event
        newSocket.on('tracking_stopped', (data) => {
            console.log("🛑 Tracking Stopped:", data);
            setStatus(`Tracking selesai. Terima kasih!`);
        });

        // Cleanup on unmount
        return () => {
            console.log("🧹 Cleaning up socket connection...");
            newSocket.disconnect();
        };
    }, [bookingId, walkerName]);

    // Koordinat Default (Jakarta) jika belum ada data
    const defaultPosition = [-6.2088, 106.8456]; 

    // Ambil lokasi awal walker untuk booking (owner) saat mount agar peta langsung center
    useEffect(() => {
        const fetchInitialWalkerLocation = async () => {
            try {
                // Hanya jalan jika ada bookingId
                if (!bookingId) return;
                // Panggil endpoint baru sesuai BACKEND_CHANGES_FOR_FE.md
                const resp = await fetch(`${import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/${bookingId}/walker-location`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
                    }
                });
                if (!resp.ok) {
                    console.warn('⚠️ Initial walker-location not available yet. Status:', resp.status);
                    return; // booking mungkin belum accepted
                }
                // Some proxies/ngrok return HTML on errors; guard before parsing JSON
                const contentType = resp.headers.get('content-type') || '';
                if (!contentType.includes('application/json')) {
                    const text = await resp.text();
                    console.warn('⚠️ Non-JSON response for walker-location:', text.slice(0, 200));
                    return;
                }
                const data = await resp.json();
                const loc = data?.data?.location;
                const lat = loc?.latitude;
                const lng = loc?.longitude;
                if (lat != null && lng != null) {
                    console.log('🎯 Initial center to walker location:', { lat, lng });
                    setPosition([lat, lng]);
                    setStatus(`${walkerName} lokasi awal terdeteksi`);
                } else {
                    console.log('ℹ️ No initial location provided in response');
                }
            } catch (e) {
                console.error('❌ Error fetching initial walker location:', e);
            }
        };
        fetchInitialWalkerLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId]);

    // Debug log
    console.log('🗺️ Map State:', { position, hasInitialZoom, isConnected });

    // Test function untuk simulasi lokasi (untuk development)
    const simulateWalkerLocation = () => {
        console.log('🧪 Simulating Walker location...');
        const testPosition = [-6.2088, 106.8456]; // Jakarta
        setPosition(testPosition);
        setStatus(`${walkerName} sedang bergerak 🏃 (TEST MODE)`);
        setLastUpdate(new Date());
        
        // Simulasi pergerakan setelah 3 detik
        setTimeout(() => {
            const newPos = [-6.2100, 106.8470]; // Bergerak sedikit
            setPosition(newPos);
            setLastUpdate(new Date());
        }, 3000);
    };

    return (
        <div className="tracking-page-container">
            <Header />
            
            <div className="tracking-page-main">
                <h2 className="tracking-title">Live Tracking 📍</h2>
                
                {/* Status & Connection Info */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    marginBottom: '20px',
                    padding: '15px',
                    background: isConnected ? '#d4edda' : '#f8d7da',
                    borderRadius: '8px',
                    border: `2px solid ${isConnected ? '#28a745' : '#dc3545'}`
                }}>
                    <span style={{ fontSize: '24px' }}>
                        {isConnected ? '🟢' : '🔴'}
                    </span>
                    <div>
                        <p className="tracking-subtitle" style={{ margin: 0, fontWeight: 'bold' }}>
                            {status}
                        </p>
                        {lastUpdate && (
                            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                Last update: {lastUpdate.toLocaleTimeString('id-ID')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="map-frame" style={{ height: '500px', border: '2px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}>
                    <MapContainer 
                        center={position || defaultPosition} 
                        zoom={15} 
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        {position ? (
                            <>
                                <MapUpdater 
                                    position={position} 
                                    isFirstLocation={!hasInitialZoom}
                                    onZoomComplete={() => setHasInitialZoom(true)}
                                />
                                <Marker position={position} icon={walkerIcon}>
                                    <Popup>
                                        <div style={{ textAlign: 'center' }}>
                                            <strong>{walkerName}</strong><br />
                                            <small>Lokasi Terkini</small><br />
                                            {lastUpdate && (
                                                <small style={{ color: '#666' }}>
                                                    {lastUpdate.toLocaleTimeString('id-ID')}
                                                </small>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            </>
                        ) : (
                            <Marker position={defaultPosition}>
                                <Popup>
                                    <div style={{ textAlign: 'center' }}>
                                        <strong>Default Location</strong><br />
                                        <small>Menunggu Walker...</small>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>

                <div className="tracking-info-box" style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 10px 0' }}>
                        <strong>📱 Booking ID:</strong> {bookingId}
                    </p>
                    <p style={{ margin: '0 0 10px 0' }}>
                        <strong>🐕 Walker:</strong> {walkerName}
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>💡 Tips:</strong> Pastikan Walker sudah mengaktifkan "Start Tracking" di aplikasi mereka.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TrackingPage;
