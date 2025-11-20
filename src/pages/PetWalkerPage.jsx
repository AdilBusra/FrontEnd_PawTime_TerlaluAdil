// src/pages/PetWalkerPage.jsx
import React from 'react';
import Header from '../components/Header';
import PetWalkerCard from '../components/PetWalkerCard'; 
import { petWalkers } from '../data/mockData'; // <-- IMPORT DARI FOLDER DATA

function PetWalkerPage({ navigateTo }) { // Terima prop navigateTo

  return (
    <div className="pet-walker-page-container">
      <Header navigateTo={navigateTo} />

      <div className="walker-list-main">
        <h2 className="walker-title">Choose your favorite Pet Walker ❤️</h2>
        
        {/* Container untuk menampung grid kartu */}
        <div className="walker-grid">
          {petWalkers.map(walker => (
            <PetWalkerCard
              key={walker.id} // Kunci unik
              id={walker.id} // <-- Teruskan ID Walker
              name={walker.name}
              location={walker.location}
              image={walker.image}
              navigateTo={navigateTo} // <-- Teruskan fungsi navigasi
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PetWalkerPage;