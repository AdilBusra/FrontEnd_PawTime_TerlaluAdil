// src/pages/PetOwnerPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAlert } from "../hooks/useAlert";

function PetOwnerPage({ userRole }) {
  const navigateTo = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownerForm, setOwnerForm] = useState({
    owner_name: "",
    owner_address: "",
    pet: {
      name: "",
      breed: "", // Mapping dari petSpecies
      age: "",
      weight: "", // Baru - untuk pet weight
      notes: "",
    },
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    // Handle nested pet properties
    if (id.startsWith("pet_")) {
      const petField = id.replace("pet_", "");
      setOwnerForm((prev) => ({
        ...prev,
        pet: {
          ...prev.pet,
          [petField]: value,
        },
      }));
    } else {
      // Handle owner properties (owner_address, owner_phone)
      setOwnerForm((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Payload dalam format nested sesuai backend requirement
      const payload = {
        owner_name: ownerForm.owner_name,
        owner_address: ownerForm.owner_address,
        pet: {
          name: ownerForm.pet.name,
          breed: ownerForm.pet.breed,
          age: ownerForm.pet.age ? parseInt(ownerForm.pet.age, 10) : null,
          weight: ownerForm.pet.weight ? parseInt(ownerForm.pet.weight, 10) : null,
          notes: ownerForm.pet.notes,
        },
      };

      console.log("Sending pet owner data:", payload);

      // POST request ke backend
      const response = await api.post("/api/owners/setup", payload);

      console.log("Pet owner setup successful:", response.data);
      showAlert({
        title: "Success",
        message: "Data peliharaan berhasil disimpan!",
        type: "success",
        confirmText: "OK",
        onConfirm: () => navigateTo("/account"),
      });
    } catch (error) {
      console.error("Error during setup:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Gagal menyimpan data. Silakan coba lagi.";
      showAlert({
        title: "Setup Failed",
        message: errorMessage,
        type: "error",
        confirmText: "OK",
      });
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
              <label htmlFor="owner_name">Full Name</label>
              <input
                type="text"
                id="owner_name"
                value={ownerForm.owner_name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="owner_address">Address</label>
              <textarea
                id="owner_address"
                rows="3"
                value={ownerForm.owner_address}
                onChange={handleChange}
                placeholder="Full address with city and postal code"
                required
              ></textarea>
            </div>
            <hr className="owner-divider-new" />
            <h3>Pet's Detail Information</h3>
            <div className="owner-input-group-new">
              <label htmlFor="pet_name">Pet's Name</label>
              <input
                type="text"
                id="pet_name"
                value={ownerForm.pet.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="owner-input-group-new">
              <label htmlFor="pet_breed">Type of Pet (Breed)</label>
              <input
                type="text"
                id="pet_breed"
                value={ownerForm.pet.breed}
                onChange={handleChange}
                placeholder="Example: Golden Retriever / Scottish Fold"
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="pet_age">Age (Year)</label>
              <input
                type="number"
                id="pet_age"
                value={ownerForm.pet.age}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="pet_weight">Weight (kg)</label>
              <input
                type="number"
                id="pet_weight"
                value={ownerForm.pet.weight}
                onChange={handleChange}
                placeholder="Pet weight in kilograms"
                min="0"
              />
            </div>
            <div className="owner-input-group-new">
              <label htmlFor="pet_notes">Important Notes</label>
              <textarea
                id="pet_notes"
                rows="4"
                value={ownerForm.pet.notes}
                onChange={handleChange}
                placeholder="Allergies, medications, or special instructions..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="owner-submit-button-new"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </div>
      </div>

      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        confirmText={alertState.confirmText}
        onClose={closeAlert}
        onConfirm={alertState.onConfirm}
      />
    </div>
  );
}

export default PetOwnerPage;
