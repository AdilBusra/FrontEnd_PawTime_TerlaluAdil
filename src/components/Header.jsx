// src/components/Header.jsx
import React from 'react';

function Header({ navigateTo }) { 
  
  const handleNavClick = (e, page) => {
    e.preventDefault(); 
    if (navigateTo) {
      navigateTo(page);
    }
  };

  return (
    <header className="main-header-container">
      <div className="navbar-content"> 
        
        <div className="logo-section">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (navigateTo) navigateTo('landing'); 
            }}
          >
            <span className="logo-text">Paw Time</span>
            <span className="logo-icon">🐾</span> 
          </a>
        </div>
        
        <nav className="action-nav">
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'walker')}
          >
            Pet Walker
          </a>
          <span className="separator">|</span>
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'booking')}
          >
            Booking
          </a>
          <span className="separator">|</span>
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'auth')}
          >
            Account
          </a>
        </nav>

      </div>
    </header>
  );
}

export default Header;