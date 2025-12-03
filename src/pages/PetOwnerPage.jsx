// src/pages/PetOwnerPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';
import api from '../api';

function PetOwnerPage({ userRole }) {
  const navigateTo = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Payload untuk backend
      const payload = {
        pet_name: ownerForm.petName,
        pet_species: ownerForm.petSpecies,
        pet_age: parseInt(ownerForm.petAge, 10),
        pet_notes: ownerForm.petNotes,
        owner_address: ownerForm.address,
        owner_phone: ownerForm.phoneNumber,
      };

      console.log("Sending pet owner data:", payload);

      // POST request ke backend
      const response = await api.post('/api/owners/setup', payload);
      
      console.log('Pet owner setup successful:', response.data);
      alert('Data peliharaan berhasil disimpan!');
      
      navigateTo('/account');
    } catch (error) {
      console.error('Error during setup:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
            Hey there, Pet Parent! <br />
          </h2>
          <p className="owner-setup-welcome-subtext">
            Connect with trusted care when you need it most🐾
          </p>
        </div>
        {/* KANAN: Kotak Formulir */}
        <div className="owner-setup-form-box-new">
          <form onSubmit={handleSubmit} className="owner-setup-form-new">
            <h3>Your Personal Information</h3>
            <div className="owner-input-group-new">
              <label htmlFor="ownerName">Full Name</label>
              <input
                type="text"
                id="ownerName"
                value={ownerForm.ownerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={ownerForm.phoneNumber}
                onChange={handleChange}
                placeholder="+62 8XX XXXX XXXX"
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                rows="3"
                value={ownerForm.address}
                onChange={handleChange}
                placeholder="Full address with city and postal code"
                required
              ></textarea>
            </div>
            <hr className="owner-divider-new" />
            <h3>Pet's Detail Information</h3>
            <div className="owner-input-group-new">
              <label htmlFor="petName">Pet's Name</label>
              <input
                type="text"
                id="petName"
                value={ownerForm.petName}
                onChange={handleChange}
                required
              />
            </div>
          
            <div className="owner-input-group-new">
              <label htmlFor="petSpecies">Type of Pet</label>
              <input
                type="text"
                id="petSpecies"
                value={ownerForm.petSpecies}
                onChange={handleChange}
                placeholder="Example: Golden Retriever / Scottish Fold"
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="petAge">Age (Year)</label>
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
              <label htmlFor="petNotes">Important Notes</label>
              <textarea
                id="petNotes"
                rows="4"
                value={ownerForm.petNotes}
                onChange={handleChange}
                placeholder="Alergi, drugs, or etc."
              ></textarea>
            </div>
            <button type="submit" className="owner-submit-button-new" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PetOwnerPage;
