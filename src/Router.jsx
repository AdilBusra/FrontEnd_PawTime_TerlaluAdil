// src/Router.jsx
import React, { useState } from 'react';

// Import semua Halaman yang kita buat
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PetWalkerPage from './pages/PetWalkerPage';
import WalkerDetailPage from './pages/WalkerDetailPage';
import WalkerSetupPage from './pages/WalkerSetupPage';
import PetOwnerPage from './pages/PetOwnerPage';


function Router() {
  const [currentPage, setCurrentPage] = useState('landing');
  // State BARU untuk menyimpan ID Walker yang dipilih
  const [selectedWalkerId, setSelectedWalkerId] = useState(null); 
  
  // Fungsi utama untuk navigasi
  const navigateTo = (page, id = null) => {
    // 1. Simpan ID Walker jika ada
    if (id !== null) {
        setSelectedWalkerId(id);
    } else {
        setSelectedWalkerId(null); // Reset ID jika pindah ke halaman lain
    }

    // 2. Tentukan halaman tujuan
    if (page === 'login' || page === 'register' || page === 'auth') {
        setCurrentPage('auth');
    } else {
        setCurrentPage(page);
    }
  };

  // Logika rendering bersyarat
  const renderPage = () => {
    if (currentPage === 'walkerSetup') {
      return <WalkerSetupPage navigateTo={navigateTo} />;
    }
    if (currentPage === 'auth') {
      return <AuthPage navigateTo={navigateTo} />;
    }
    if (currentPage === 'walker') {
      return <PetWalkerPage navigateTo={navigateTo} />;
    }
    if (currentPage === 'detail') {
      // Meneruskan ID Walker yang dipilih ke Halaman Detail
      return <WalkerDetailPage navigateTo={navigateTo} walkerId={selectedWalkerId} />;
    }
    if (currentPage === 'ownerSetup') { // <-- KONDISI BARU
      return <PetOwnerPage navigateTo={navigateTo} />;
    }
    
    return <LandingPage navigateTo={navigateTo} />;
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}

export default Router;