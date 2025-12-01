// src/pages/PetOwnerPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';

function PetOwnerPage({ userRole }) {
  const navigateTo = useNavigate();
  const [ownerForm, setOwnerForm] = useState({
    ownerName: "",
    phoneNumber: "",
    address: "",
    petName: "",
    petSpecies: "", // Default
    petAge: "",
    petNotes: "",
  });

  const handleChange = (e) => {
    setOwnerForm({
      ...ownerForm,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Pet Owner Siap:", ownerForm);
    navigateTo ('/account');
  };

  return (
    <div className="pet-owner-page-container">
    <Header userRole={userRole} />

      <div className="owner-setup-content-main">
        {" "}
        {/* Kontainer utama flexbox */}
        {/* KIRI: Teks Sambutan (Mirip Walker Setup) */}
        <div className="owner-setup-welcome-text">
          <h2 className="owner-setup-welcome-heading">
            Halo, Pet Owner! <br />
            Kami Siap Bantu Rawat Peliharaanmu 🐾
          </h2>
          <p className="owner-setup-welcome-subtext">
            Isi detail hewan kesayangan Anda agar Walker kami bisa <br />
            memberikan pelayanan terbaik.
          </p>
        </div>
        {/* KANAN: Kotak Formulir */}
        <div className="owner-setup-form-box-new">
          <form onSubmit={handleSubmit} className="owner-setup-form-new">
            <h3>Informasi Kontak Anda</h3>
            <div className="owner-input-group-new">
              <label htmlFor="ownerName">Nama Anda</label>
              <input
                type="text"
                id="ownerName"
                value={ownerForm.ownerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="phoneNumber">Nomor HP</label>
              <input
                type="tel"
                id="phoneNumber"
                value={ownerForm.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="address">Alamat</label>
              <textarea
                id="address"
                rows="3"
                value={ownerForm.address}
                onChange={handleChange}
                placeholder="Alamat lengkap Anda"
                required
              ></textarea>
            </div>
            <hr className="owner-divider-new" />
            <h3>Detail Hewan Peliharaan</h3>
            <div className="owner-input-group-new">
              <label htmlFor="petName">Nama Peliharaan</label>
              <input
                type="text"
                id="petName"
                value={ownerForm.petName}
                onChange={handleChange}
                required
              />
            </div>
          
            <div className="owner-input-group-new">
              <label htmlFor="petSpecies">Jenis</label>
              <input
                type="text"
                id="petSpecies"
                value={ownerForm.petSpecies}
                onChange={handleChange}
                placeholder="Contoh: Golden Retriever / Scottish Fold"
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="petAge">Usia (Tahun)</label>
              <input
                type="number"
                id="petAge"
                value={ownerForm.petAge}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="petNotes">Catatan Penting</label>
              <textarea
                id="petNotes"
                rows="4"
                value={ownerForm.petNotes}
                onChange={handleChange}
                placeholder="Alergi, obat-obatan, atau sifat khusus."
              ></textarea>
            </div>
            <button type="submit" className="owner-submit-button-new">
              Simpan Detail Peliharaan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PetOwnerPage;
