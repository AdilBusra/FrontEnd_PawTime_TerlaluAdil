// src/pages/TrackingPage.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import Header from '../components/Header';

// --- FIX ICON LEAFLET (Wajib ada biar icon muncul) ---
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- KONFIGURASI SOCKET ---
// Ganti URL ini dengan URL Ngrok Backend Anda!
const SOCKET_URL = "https://predoubtful-nonincorporated-tonia.ngrok-free.dev"; 

function TrackingPage({ navigateTo, userRole }) {
    const [position, setPosition] = useState(null); // Koordinat Walker
    const [status, setStatus] = useState("Menunggu Sinyal Walker...");

    useEffect(() => {
        const newSocket = io(SOCKET_URL, { transports: ['websocket'] });
        
        newSocket.on('connect', () => {
            console.log("Connected to Socket Server");
            // Join Room Dummy (Sesuai dengan yang di-test di backend)
            newSocket.emit('join_room', 'booking-123'); 
        });

        newSocket.on('live_location', (data) => {
            console.log("Lokasi Diterima:", data);
            setPosition([data.latitude, data.longitude]);
            setStatus("Walker Sedang Bergerak 🏃");
        });

        return () => newSocket.disconnect();
    }, []);

    // Koordinat Default (Misal: Monas Jakarta) jika belum ada data
    const defaultPosition = [-6.1751, 106.8650]; 

    return (
        <div className="tracking-page-container">
            <Header navigateTo={navigateTo} userRole={userRole} />
            
            <div className="tracking-page-main">
                <h2 className="tracking-title">Live Tracking 📍</h2>
                <p className="tracking-subtitle">{status}</p>

                <div className="map-frame">
                    <MapContainer 
                        center={position || defaultPosition} 
                        zoom={15} 
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        {position && (
                            <Marker position={position}>
                                <Popup>
                                    Lokasi Walker Terkini!
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>

                <div className="tracking-info-box">
                    <p style={{ margin: 0 }}>
                        <strong>Tips:</strong> Pastikan Walker (HP Teman) sudah klik "Start Tracking"
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TrackingPage;
