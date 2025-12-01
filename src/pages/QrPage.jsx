// src/pages/QrPage.jsx (Halaman 9 & 10)
import React, { useState } from 'react';
import Header from '../components/Header';
// Catatan: Gunakan gambar QR Code placeholder Anda sendiri di folder assets
import qrPlaceholder from '../assets/download(11).jpeg'; // Pastikan file ini ada!

// Menerima prop 'type' untuk menentukan halaman mana yang ditampilkan (tracking atau payment)
function QrPage({ type = 'tracking' }) { 
    
    // State hanya untuk simulasi sukses pembayaran
    const [isPaid, setIsPaid] = useState(false);

    const title = type === 'tracking' 
        ? "Scan QR Code to Track the Pet Walker" 
        : "Complete Your Payment (QRIS)";
        
    const qrImage = type === 'tracking' 
        ? qrPlaceholder // Ganti dengan gambar QR Tracking jika ada
        : qrPlaceholder; // Ganti dengan gambar QRIS Payment jika ada

    const handlePayment = () => {
        if (type === 'payment' && !isPaid) {
            alert('Simulasi Pembayaran Berhasil!');
            setIsPaid(true);
        }
    };

    return (
        <div className="qr-page-container">
            <Header/>
            
            <div className="qr-page-main">
                <h2 className="qr-code-title">{title}</h2>
                
                <div className="qr-code-box" onClick={handlePayment}>
                    <img 
                        src={qrImage} 
                        alt={type === 'tracking' ? 'QR Code Tracking' : 'QRIS Code'} 
                    />
                </div>
                
                {/* Tampilan Khusus Pembayaran (Halaman 10) */}
                {type === 'payment' && (
                    <>
                        <p className="payment-amount">Rp 50.000,-</p>
                        {isPaid && (
                            <div className="payment-success-details">
                                <h3 className="payment-success">Payment Success!!!</h3>
                                <p style={{ fontSize: '14px' }}>Details: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                            </div>
                        )}
                        {!isPaid && (
                             <p style={{ fontSize: '14px', marginTop: '10px' }}>Klik QR Code di atas untuk simulasi pembayaran.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default QrPage;