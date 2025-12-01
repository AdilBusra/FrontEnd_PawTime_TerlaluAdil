// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // <-- IMPORT BARU
import './App.css'; 

// Import semua halaman yang sebelumnya ada di Router.jsx
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PetWalkerPage from './pages/PetWalkerPage';
import WalkerDetailPage from './pages/WalkerDetailPage';
import BookingPage from './pages/BookingPage';
import StatusPage from './pages/StatusPage';
import QrPage from './pages/QrPage';
import RatingPage from './pages/RatingPage';
import WalkerSetupPage from './pages/WalkerSetupPage';
import WalkerConfirmationPage from './pages/WalkerConfirmationPage';
import AccountPage from './pages/AccountPage';
import PetOwnerPage from './pages/PetOwnerPage';
import TrackingPage from './pages/TrackingPage'; // Live Tracking dengan Maps

function App() {
  return (
    <div className="app-container">
      {/* Container untuk semua Route */}
      <Routes>
        {/* URL Path: Komponen */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/walkers" element={<PetWalkerPage />} />
        
        {/* Menggunakan :id untuk detail walker. ID diakses via useParams() */}
        <Route path="/walker/:id" element={<WalkerDetailPage />} /> 

        <Route path="/booking" element={<BookingPage />} /> 
        
        {/* Status Pages. StatusPage harus bisa menangani state isConfirmed di dalamnya */}
        <Route path="/status/waiting" element={<StatusPage />} />
        <Route path="/status/confirmed" element={<StatusPage isConfirmed={true} />} />
        
        {/* Live Tracking Page with Maps */}
        <Route path="/tracking" element={<TrackingPage />} />
        
        {/* QR Pages. Component harus bisa menangani prop type */}
        <Route path="/qr/tracking" element={<QrPage type="tracking" />} />
        <Route path="/qr/payment" element={<QrPage type="payment" />} />
        
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/setup/walker" element={<WalkerSetupPage />} />
        <Route path="/setup/confirm" element={<WalkerConfirmationPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/setup/owner" element={<PetOwnerPage />} />

        {/* Jika tidak ada path yang cocok, arahkan ke Landing Page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;