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
import WalkerTrackingPage from './pages/WalkerTrackingPage'; // Walker Tracking Control
import ProtectedRoute from './components/ProtectedRoute'; // Protected Route Component

function App() {
  return (
    <div className="app-container">
      {/* Container untuk semua Route */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/walkers" element={
          <ProtectedRoute>
            <PetWalkerPage />
          </ProtectedRoute>
        } />
        
        <Route path="/walker/:id" element={
          <ProtectedRoute>
            <WalkerDetailPage />
          </ProtectedRoute>
        } /> 

        <Route path="/booking" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } /> 
        
        <Route path="/status/waiting" element={
          <ProtectedRoute>
            <StatusPage />
          </ProtectedRoute>
        } />
        <Route path="/status/confirmed" element={
          <ProtectedRoute>
            <StatusPage isConfirmed={true} />
          </ProtectedRoute>
        } />
        
        <Route path="/tracking" element={
          <ProtectedRoute>
            <TrackingPage />
          </ProtectedRoute>
        } />
        
        <Route path="/walker-tracking" element={
          <ProtectedRoute requireRole="walker">
            <WalkerTrackingPage />
          </ProtectedRoute>
        } />
        
        <Route path="/qr/tracking" element={
          <ProtectedRoute>
            <QrPage type="tracking" />
          </ProtectedRoute>
        } />
        <Route path="/qr/payment" element={
          <ProtectedRoute>
            <QrPage type="payment" />
          </ProtectedRoute>
        } />
        
        <Route path="/rating" element={
          <ProtectedRoute>
            <RatingPage />
          </ProtectedRoute>
        } />
        
        {/* Walker-specific Protected Routes */}
        <Route path="/setup/walker" element={
          <ProtectedRoute requireRole="walker">
            <WalkerSetupPage />
          </ProtectedRoute>
        } />
        <Route path="/setup/confirm" element={
          <ProtectedRoute requireRole="walker">
            <WalkerConfirmationPage />
          </ProtectedRoute>
        } />
        
        {/* Owner-specific Protected Routes */}
        <Route path="/setup/owner" element={
          <ProtectedRoute requireRole="owner">
            <PetOwnerPage />
          </ProtectedRoute>
        } />
        
        {/* Account Page - All authenticated users */}
        <Route path="/account" element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } />

        {/* Jika tidak ada path yang cocok, arahkan ke Landing Page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;