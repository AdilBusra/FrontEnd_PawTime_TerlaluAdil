// src/pages/WalkerSetupPage.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { supabase } from '../supabaseClient';

function WalkerSetupPage({ userRole }) {
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({
    photo: null, // Untuk file foto
    location: '',
    fee: '',
    qris: null, // Untuk file QRIS
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false); // State untuk loading indicator

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

  // Fungsi helper untuk upload image ke Supabase Storage
  const uploadToSupabase = async (file) => {
    if (!file) return null;

    try {
      // Generate unique filename: Date.now() + '_' + file.name (hindari spasi)
      const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `${uniqueFileName}`;

      // Upload file ke Supabase Storage bucket 'pawtime_bucket'
      const { data, error: uploadError } = await supabase.storage
        .from('pawtime_bucket')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload gagal: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pawtime_bucket')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('File uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error during image upload:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Set loading state
      setIsLoading(true);
      console.log("Mulai upload file...");

      // Upload profile photo
      let photoUrl = null;
      if (profileForm.photo) {
        console.log("Uploading photo...");
        photoUrl = await uploadToSupabase(profileForm.photo);
      }

      // Upload QRIS image
      let qrisUrl = null;
      if (profileForm.qris) {
        console.log("Uploading QRIS...");
        qrisUrl = await uploadToSupabase(profileForm.qris);
      }

      // Prepare payload untuk backend
      const payload = {
        location_name: profileForm.location,
        hourly_rate: parseInt(profileForm.fee, 10), // Convert to number
        bio: profileForm.description,
        photo_url: photoUrl,
        qris_url: qrisUrl,
      };

      console.log("Payload untuk backend:", payload);

      // Pastikan token ada sebelum kirim request (untuk mencegah 401)
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Anda belum login. Silakan login terlebih dahulu.');
      }

      // Send data ke backend API (pakai instance api agar Authorization tersisip otomatis)
      // Tambahkan header Authorization secara eksplisit sebagai jaga-jaga
      const response = await api.post(
        '/api/walkers/setup',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Walker setup successful:', response.data);

      alert('Profil Walker berhasil disimpan!');
      // Setelah sukses, arahkan ke halaman Account
      navigate('/account');
    } catch (error) {
      console.error('Error during setup:', error);
      alert(`Gagal menyimpan profil: ${error.message}`);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="walker-setup-page-container">
<Header userRole={userRole} />
      
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

            <button 
              type="submit" 
              className="setup-submit-button-new"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WalkerSetupPage;