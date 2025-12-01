// src/components/Header.jsx
import React from 'react';

// Terima userRole dari prop yang diteruskan dari Page Component
function Header({ navigateTo, userRole }) { 
  
  // FUNGSI UTAMA UNTUK NAVIGASI KONDISIONAL
  const handleNavClick = (e, targetPage) => {
    e.preventDefault(); 
    
    // Status login: Jika userRole adalah string ('owner'/'walker'), maka TRUE
    const isLoggedIn = userRole !== null; 
    
    // Rute yang membutuhkan otentikasi (SEKARANG TERMASUK 'walker')
    const requiresAuth = (targetPage === 'walker' || targetPage === 'booking' || targetPage === 'auth');
    
    // 1. Jika BELUM LOGIN dan mencoba mengakses fitur yang membutuhkan Auth
    if (!isLoggedIn && requiresAuth) {
      navigateTo('auth'); // Arahkan ke halaman Login/Register
    } 
    // 2. Jika SUDAH LOGIN dan mengklik "Account" (targetPage='auth')
    else if (isLoggedIn && targetPage === 'auth') {
        navigateTo('account'); // Bawa ke Dashboard
    }
    // 3. Untuk semua kasus lainnya (Landing Page, atau sudah login dan menuju fitur)
    else {
      navigateTo(targetPage);
    }
  };

  return (
    <header className="main-header-container">
      <div className="navbar-content"> 
        
        <div className="logo-section">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigateTo('landing'); }}
          >
            <span className="logo-text">Paw Time</span>
            <span className="logo-icon">🐾</span> 
          </a>
        </div>
        
        <nav className="action-nav">
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'walker')} // Pet Walker (PERLU AUTH)
          >
            Pet Walker
          </a>
          <span className="separator">|</span>
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'booking')} // Booking (PERLU AUTH)
          >
            Booking
          </a>
          <span className="separator">|</span>
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'auth')} // Account (Perlu AUTH)
          >
            Account
          </a>
        </nav>

      </div>
    </header>
  );
}

export default Header;