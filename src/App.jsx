// src/App.jsx

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // <-- IMPORT BARU
import "./App.css";
import api from "./api"; // Import API untuk sync data

// Import semua halaman yang sebelumnya ada di Router.jsx
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PetWalkerPage from "./pages/PetWalkerPage";
import WalkerDetailPage from "./pages/WalkerDetailPage";
import BookingPage from "./pages/BookingPage";
import HistoryPage from "./pages/HistoryPage";
import StatusPage from "./pages/StatusPage";
import QrPage from "./pages/QrPage";
import RatingPage from "./pages/RatingPage";
import WalkerSetupPage from "./pages/WalkerSetupPage";
import WalkerConfirmationPage from "./pages/WalkerConfirmationPage";
import WalkerActiveBookingsPage from "./pages/WalkerActiveBookingsPage";
import AccountPage from "./pages/AccountPage";
import PetOwnerPage from "./pages/PetOwnerPage";
import TrackingPage from "./pages/TrackingPage"; // Live Tracking dengan Maps
import WalkerTrackingPage from "./pages/WalkerTrackingPage"; // Walker Tracking Control
import ProtectedRoute from "./components/ProtectedRoute"; // Protected Route Component

function App() {
  // Sync user data dari database saat app startup
  useEffect(() => {
    const syncUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRaw = localStorage.getItem("user");

        // Hanya sync jika user sudah login
        if (token && userRaw) {
          console.log("🔄 Syncing user data from database on app startup...");

          // Fetch latest user data dari backend
          const response = await api.get("/api/users/me");
          const latestUserData = response?.data?.data;

          if (latestUserData) {
            // Update localStorage dengan data terbaru dari database
            const currentUser = JSON.parse(userRaw);
            const updatedUser = {
              ...currentUser,
              ...latestUserData, // Merge dengan data terbaru dari DB
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            console.log("✅ User data synced with database:", updatedUser);
          }
        }
      } catch (error) {
        // Jika sync gagal, gunakan data dari localStorage
        console.warn("⚠️ Failed to sync user data from database:", error);
        console.log("💾 Using cached data from localStorage");
      }
    };

    // Call sync function saat app mount
    syncUserData();
  }, []);
  return (
    <div className="app-container">
      {/* Container untuk semua Route */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/walkers"
          element={
            <ProtectedRoute>
              <PetWalkerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/walker/:id"
          element={
            <ProtectedRoute>
              <WalkerDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/status/waiting"
          element={
            <ProtectedRoute>
              <StatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status/confirmed"
          element={
            <ProtectedRoute>
              <StatusPage isConfirmed={true} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <TrackingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/walker-tracking"
          element={
            <ProtectedRoute requireRole="walker">
              <WalkerTrackingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/qr/tracking"
          element={
            <ProtectedRoute>
              <QrPage type="tracking" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr/payment"
          element={
            <ProtectedRoute>
              <QrPage type="payment" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rating"
          element={
            <ProtectedRoute>
              <RatingPage />
            </ProtectedRoute>
          }
        />

        {/* Walker-specific Protected Routes */}
        <Route
          path="/setup/walker"
          element={
            <ProtectedRoute requireRole="walker">
              <WalkerSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup/confirm"
          element={
            <ProtectedRoute requireRole="walker">
              <WalkerConfirmationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/walker/active"
          element={
            <ProtectedRoute requireRole="walker">
              <WalkerActiveBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Owner-specific Protected Routes */}
        <Route
          path="/setup/owner"
          element={
            <ProtectedRoute requireRole="owner">
              <PetOwnerPage />
            </ProtectedRoute>
          }
        />

        {/* Account Page - All authenticated users */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />

        {/* Jika tidak ada path yang cocok, arahkan ke Landing Page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
