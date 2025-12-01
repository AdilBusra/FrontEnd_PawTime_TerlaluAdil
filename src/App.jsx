// src/App.jsx
import { useState } from "react";
import "./App.css";

// Import semua Komponen Halaman
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PetWalkerPage from "./pages/PetWalkerPage";
import WalkerDetailPage from "./pages/WalkerDetailPage";
import WalkerSetupPage from "./pages/WalkerSetupPage";
import PetOwnerPage from "./pages/PetOwnerPage";
import AccountPage from "./pages/AccountPage";


function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [userRole, setUserRole] = useState(null); 
  
  // *** 1. STATE BARU UNTUK ID WALKER ***
  const [selectedWalkerId, setSelectedWalkerId] = useState(null); 
  // *************************************
  
  const setLoggedInUserRole = (role) => {
      setUserRole(role);
  };


  // *** 2. FUNGSI navigateTo DIMODIFIKASI ***
  const navigateTo = (page, id = null) => {
    setCurrentPage(page);
    // Simpan ID jika ID dikirimkan
    if (id !== null) {
        setSelectedWalkerId(id);
    }
  };
  // *****************************************

  const renderPage = () => {
    
    if (currentPage === "auth") {
      return <AuthPage navigateTo={navigateTo} setLoggedInUserRole={setLoggedInUserRole} userRole={userRole} />;
    }
    
    if (currentPage === 'walkerSetup') {
        return <WalkerSetupPage navigateTo={navigateTo} userRole={userRole} />;
    }
    if (currentPage === 'ownerSetup') {
        return <PetOwnerPage navigateTo={navigateTo} userRole={userRole} />;
    }
    
    if (currentPage === 'account') {
        return <AccountPage navigateTo={navigateTo} userRole={userRole} />;
    }
    
    if (currentPage === "walker") {
      return <PetWalkerPage navigateTo={navigateTo} userRole={userRole} />;
    }
    
    // *** 3. WALKER DETAIL PAGE DENGAN walkerId ***
    if (currentPage === "detail") { 
      return (
        <WalkerDetailPage 
          navigateTo={navigateTo} 
          userRole={userRole} 
          walkerId={selectedWalkerId} // Meneruskan ID ke komponen detail
        />
      ); 
    }
    // **********************************************
    
    // Default
    return <LandingPage navigateTo={navigateTo} userRole={userRole} />;
  };

  return <div className="app-container">{renderPage()}</div>;
}

export default App;