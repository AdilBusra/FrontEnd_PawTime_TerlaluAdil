// src/pages/WalkerSetupPage.jsx
import React, { useState } from 'react';
import Header from '../components/Header';

function WalkerSetupPage({ navigateTo }) {
  const [profileForm, setProfileForm] = useState({
    photo: null, // Untuk file foto
    location: '',
    fee: '',
    qris: null, // Untuk file QRIS
    description: '',
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      // Jika input type="file", simpan objek File
      setProfileForm({
        ...profileForm,
        [id]: files[0], // Ambil file pertama
      });
    } else {
      // Jika input biasa
      setProfileForm({
        ...profileForm,
        [id]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Profil Walker Siap (Termasuk File):", profileForm);
    alert("Data Profil Berhasil Disimpan! Anda sekarang bisa menerima Booking.");
    // Setelah sukses, arahkan ke halaman Dashboard Akun
    navigateTo('account'); 
  };

  return (
    <div className="walker-setup-page-container">
      <Header navigateTo={navigateTo} />
      
      <div className="setup-content-main">
        
        {/* KIRI: Teks Sambutan */}
        <div className="setup-welcome-text">
          <h2 className="setup-welcome-heading">
            Interested in becoming <br />a Pet Walker?🥳
          </h2>
          <p className="setup-welcome-subtext">Let's fulfill your identity</p>
        </div>

        {/* KANAN: Kotak Formulir */}
        <div className="setup-form-box-new">
          <form onSubmit={handleSubmit} className="setup-form-new">
            
            {/* Input Photo Upload */}
            <div className="setup-input-group-new upload-group">
              <label htmlFor="photo">Photo</label>
              <div className="file-upload-wrapper">
                <input type="file" id="photo" onChange={handleChange} />
                <span className="upload-button">⇧ photo</span>
              </div>
            </div>

            {/* Input Location */}
            <div className="setup-input-group-new">
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location" 
                value={profileForm.location}
                onChange={handleChange}
                placeholder="Ex: Jakarta, Medan"
                required 
              />
            </div>

            {/* Input Fee / Hour */}
            <div className="setup-input-group-new">
              <label htmlFor="fee">Fee / Hour</label>
              <input 
                type="number" 
                id="fee" 
                value={profileForm.fee}
                onChange={handleChange}
                placeholder="Ex: 50000"
                required 
              />
            </div>

            {/* Input QRIS Upload */}
            <div className="setup-input-group-new upload-group">
              <label htmlFor="qris">QRIS</label>
              <div className="file-upload-wrapper">
                <input type="file" id="qris" onChange={handleChange} />
                <span className="upload-button">⇧ photo</span>
              </div>
            </div>

            {/* Input Description */}
            <div className="setup-input-group-new">
              <label htmlFor="description">Description</label>
              <textarea 
                id="description" 
                rows="5" 
                value={profileForm.description}
                onChange={handleChange}
                placeholder="Jelaskan pengalaman, keahlian, dan jenis hewan yang Anda tangani..."
                required 
              />
            </div>

            <button type="submit" className="setup-submit-button-new">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WalkerSetupPage;