// src/components/Header.jsx (SETELAH PERUBAHAN)
import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- BARU

// Tidak lagi menerima prop navigateTo
function Header({ userRole }) { 
  
  const navigate = useNavigate(); // <-- Panggil Hook
  
  // FUNGSI UTAMA UNTUK NAVIGASI KONDISIONAL
  const handleNavClick = (e, targetPage) => {
    e.preventDefault(); 
    
    // Status login: Jika userRole adalah string ('owner'/'walker'), maka TRUE
    const isLoggedIn = userRole !== null; 
    
    // Rute yang membutuhkan otentikasi (SEKARANG TERMASUK 'walker')
    const requiresAuth = (targetPage === 'walkers' || targetPage === 'booking'); // Ubah 'walker' menjadi URL path '/walkers'
    
    // 1. Jika BELUM LOGIN dan mencoba mengakses fitur yang membutuhkan Auth
    if (!isLoggedIn && requiresAuth) {
      navigate('/auth'); // Arahkan ke halaman Login/Register (Menggunakan URL path /auth)
    } 
    // 2. Jika SUDAH LOGIN dan mengklik "Account" (targetPage='auth')
    else if (isLoggedIn && targetPage === 'auth') {
        navigate('/account'); // Bawa ke Dashboard (Menggunakan URL path /account)
    }
    // 3. Untuk semua kasus lainnya (Landing Page, atau sudah login dan menuju fitur)
    else {
      // Perhatikan mapping URL: 
      // 'walker' -> '/walkers' (sesuai App.jsx)
      // 'auth' -> '/auth'
      const urlPath = targetPage === 'walker' ? '/walkers' : `/${targetPage}`;
      navigate(urlPath);
    }
  };

  return (
    <header className="main-header-container">
      <div className="navbar-content"> 
        
        <div className="logo-section">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate('/'); }} // Navigasi ke root path
          >
            <span className="logo-text">Paw Time</span>
            <span className="logo-icon">🐾</span> 
          </a>
        </div>
        
        <nav className="action-nav">
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'walker')} // Pet Walker (mengarah ke /walkers)
          >
            Pet Walker
          </a>
          <span className="separator">|</span>
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'booking')} // Booking (mengarah ke /booking)
          >
            Booking
          </a>
          <span className="separator">|</span>
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'auth')} // Account (mengarah ke /auth atau /account)
          >
            Account
          </a>
        </nav>

      </div>
    </header>
  );
}

export default Header;