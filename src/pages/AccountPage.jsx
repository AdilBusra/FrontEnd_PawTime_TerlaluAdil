// src/pages/AccountPage.jsx (Halaman 14)
import React, { useState } from 'react';
import Header from '../components/Header';
import christellaProfile from '../assets/download(9).jpeg'; // Contoh foto profil

function AccountPage({ navigateTo }) {
    const [profile, setProfile] = useState({
        name: 'Christella',
        phone: '085208997612',
        email: 'christella@gmail.com',
        // Tambahkan role dan data lain jika perlu
        role: 'walker'
    });
    // State untuk mode edit (simulasi)
    const [isEditing, setIsEditing] = useState(null); // null, 'name', 'phone', atau 'email'
    const [tempValue, setTempValue] = useState('');

    const handleEditClick = (field) => {
        setIsEditing(field);
        setTempValue(profile[field]); // Isi nilai sementara dengan nilai saat ini
    };

    const handleSaveEdit = (field) => {
        if (tempValue.trim() === '') {
            alert('Nilai tidak boleh kosong!');
            return;
        }
        setProfile({ ...profile, [field]: tempValue });
        setIsEditing(null);
        alert(`Detail ${field} berhasil diubah!`);
    };

    const renderDetailRow = (label, field) => (
        <div className="detail-row-account">
            <label>{label}</label>
            {isEditing === field ? (
                <>
                    <input 
                        type={field === 'email' ? 'email' : 'text'}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        style={{ flex: 1, padding: '5px', borderRadius: '5px', border: 'none', color: '#4A69BB' }}
                    />
                    <span 
                        className="edit-icon" 
                        onClick={() => handleSaveEdit(field)}
                        style={{ color: '#A3D8A5', cursor: 'pointer' }}
                    >
                        ✓
                    </span>
                </>
            ) : (
                <>
                    <span>{profile[field]}</span>
                    <span 
                        className="edit-icon" 
                        onClick={() => handleEditClick(field)}
                    >
                        ✎
                    </span>
                </>
            )}
        </div>
    );

    return (
        <div className="account-page-container">
            <Header navigateTo={navigateTo} />
            
            <div className="account-page-main">
                <h2 className="profile-heading">Your Amazing Profile ❤️</h2>
                
                <div className="profile-card">
                    
                    {/* KIRI: Foto Profil */}
                    <div className="profile-photo-container">
                        <img src={christellaProfile} alt={profile.name} />
                        <button className="edit-photo-btn">edit ✎</button>
                    </div>
                    
                    {/* KANAN: Detail Akun */}
                    <div className="profile-details">
                        {renderDetailRow('Name', 'name')}
                        {renderDetailRow('Phone Number', 'phone')}
                        {renderDetailRow('Email', 'email')}

                        {/* Tambahkan tombol jika Walker */}
                        {profile.role === 'walker' && (
                             <button 
                                style={{ 
                                    padding: '10px 20px', 
                                    backgroundColor: '#FFD700', 
                                    color: '#4A69BB', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    fontWeight: '700',
                                    marginTop: '20px'
                                }}
                                onClick={() => navigateTo('walkerConfirm')}
                             >
                                Cek Konfirmasi Booking
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountPage;
