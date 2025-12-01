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
  // STATE BARU: Menyimpan role pengguna yang sudah login
  const [userRole, setUserRole] = useState(null); 
  
  // FUNGSI BARU: Mengatur role pengguna
  const setLoggedInUserRole = (role) => {
      setUserRole(role);
  };


  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    // PENTING: Meneruskan userRole ke setiap Halaman
    
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
    if (currentPage === "detail") {
      // Kita harus meneruskan walkerId di sini jika ada (meskipun sekarang disederhanakan)
      return <WalkerDetailPage navigateTo={navigateTo} userRole={userRole} />; 
    }
    
    // Default
    return <LandingPage navigateTo={navigateTo} userRole={userRole} />;
  };

  return <div className="app-container">{renderPage()}</div>;
}

export default App;