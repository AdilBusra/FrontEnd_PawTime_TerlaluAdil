// src/Router.jsx (Contoh Adaptasi)
import React, { useState } from 'react';
import LandingPage from './pages/LandingPage'; // Hlm 1
import AuthPage from './pages/AuthPage'; // Hlm 2 & 3
import PetWalkerPage from './pages/PetWalkerPage'; // Hlm 4
import WalkerDetailPage from './pages/WalkerDetailPage'; // Hlm 5
import BookingPage from './pages/BookingPage'; // Hlm 6
import StatusPage from './pages/StatusPage'; // Hlm 7 & 8
import QrPage from './pages/QrPage'; // Hlm 9 & 10
import RatingPage from './pages/RatingPage'; // Hlm 11
import WalkerSetupPage from './pages/WalkerSetupPage'; // Hlm 12
import WalkerConfirmationPage from './pages/WalkerConfirmationPage'; // Hlm 13
import AccountPage from './pages/AccountPage'; // Hlm 14
import PetOwnerPage from './pages/PetOwnerPage'; // Pet Owner Setup (Bridging)
import TrackingPage from './pages/TrackingPage'; // Live Tracking dengan Maps

function Router() {
    // State untuk melacak halaman yang sedang aktif dan data tambahan (misal ID Walker)
    const [currentPage, setCurrentPage] = useState('landing');
    const [pageData, setPageData] = useState({});

    // Fungsi utama untuk navigasi
    const navigateTo = (pageName, data = {}) => {
        setCurrentPage(pageName);
        setPageData(data);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'landing':
                return <LandingPage navigateTo={navigateTo} />;
            case 'auth':
                return <AuthPage navigateTo={navigateTo} />;
            case 'walker':
                return <PetWalkerPage navigateTo={navigateTo} />;
            case 'detail':
                // Meneruskan ID Walker yang dipilih ke halaman detail
                return <WalkerDetailPage navigateTo={navigateTo} walkerId={pageData} />;
            case 'booking':
                // Meneruskan data walker ke halaman booking
                return <BookingPage navigateTo={navigateTo} data={pageData} />; 
            case 'waiting':
                return <StatusPage navigateTo={navigateTo} />;
            case 'confirmed':
                // Jika ingin langsung menampilkan Confirmed (Halaman 8)
                return <StatusPage navigateTo={navigateTo} isConfirmed={true} />; 
            case 'tracking':
                // Menampilkan Live Tracking Page dengan Maps
                return <TrackingPage navigateTo={navigateTo} />;
            case 'payment':
                // Menampilkan QR Page untuk Payment (Halaman 10)
                return <QrPage navigateTo={navigateTo} type="payment" />;
            case 'rating':
                return <RatingPage navigateTo={navigateTo} />; // Halaman 11
            case 'walkerSetup':
                return <WalkerSetupPage navigateTo={navigateTo} />; // Halaman 12
            case 'walkerConfirm':
                return <WalkerConfirmationPage navigateTo={navigateTo} />; // Halaman 13
            case 'account':
                return <AccountPage navigateTo={navigateTo} />; // Halaman 14
            case 'ownerSetup':
                return <PetOwnerPage navigateTo={navigateTo} />; // Bridging Pet Owner
            default:
                return <LandingPage navigateTo={navigateTo} />;
        }
    };

    return <div className="app-container">{renderPage()}</div>;
}

export default Router;