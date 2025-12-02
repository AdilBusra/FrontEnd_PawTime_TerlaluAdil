// src/pages/PetWalkerPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PetWalkerCard from '../components/PetWalkerCard';
import api from '../api';

function PetWalkerPage({ userRole }) {
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalkers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/walkers');
        
        // Debug: Lihat bentuk response dari backend
        console.log("API Response:", response.data);
        
        // Ekstrak array walkers dari response
        let walkersArray = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          walkersArray = response.data.data;
        } else if (Array.isArray(response.data)) {
          walkersArray = response.data;
        } else {
          console.warn("Response format tidak dikenali:", response.data);
          walkersArray = [];
        }
        
        console.log("Walkers Array:", walkersArray);
        setWalkers(walkersArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching walkers:', err);
        setError('Failed to load walkers. Please try again later.');
        setWalkers([]); // Pastikan tetap array kosong saat error
      } finally {
        setLoading(false);
      }
    };

    fetchWalkers();
  }, []);

  return (
    <div className="pet-walker-page-container">
      <Header userRole={userRole} />

      <div className="walker-list-main">
        <h2 className="walker-title">Choose your favorite Pet Walker ❤️</h2>
        
        {loading && <p className="loading-message">Loading walkers...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {/* Container untuk menampung grid kartu */}
        <div className="walker-grid">
          {!loading && !error && Array.isArray(walkers) && walkers.length > 0 ? (
            walkers.map(walker => {
              // Prioritas: location_name > location > address > default
              let locationString = "Jakarta"; // Default fallback
              
              if (walker.location_name && typeof walker.location_name === 'string') {
                // Prioritas pertama: location_name dari backend
                locationString = walker.location_name;
              } else if (walker.location && typeof walker.location === 'string') {
                locationString = walker.location;
              } else if (walker.address && typeof walker.address === 'string') {
                locationString = walker.address;
              } else if (walker.location && typeof walker.location === 'object') {
                // Jika location adalah object
                if (walker.location.name) {
                  locationString = walker.location.name;
                } else if (walker.location.city) {
                  locationString = walker.location.city;
                } else {
                  locationString = JSON.stringify(walker.location);
                }
              }

              return (
                <PetWalkerCard
                  key={walker.id}
                  id={walker.id}
                  name={walker.name || walker.user?.name || "Unknown Walker"}
                  location={locationString}
                  image={walker.photo_url}
                />
              );
            })
          ) : (
            !loading && !error && <p className="no-walkers-message">Tidak ada walker ditemukan</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetWalkerPage;
