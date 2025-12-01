// src/pages/BookingPage.jsx (Halaman 6)
import React, { useState } from 'react';
import Header from '../components/Header';

// Menerima data dari halaman Walker Detail Page (jika ada)
function BookingPage({ navigateTo, data = {} }) { 
    
    // Default Walker Name bisa diambil dari parameter data
    const defaultWalkerName = data.walkerName || "Pilih Walker Dulu";

    const [bookingForm, setBookingForm] = useState({
        walker: defaultWalkerName, // Nama Walker
        owner: 'Maria', // Simulasi nama owner yang sudah login
        phone: '0852xxxxxx', // Simulasi data owner yang sudah login    
        address: '', 
        date: '',
        time: '',
        duration: 1, // Default 1 jam
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setBookingForm({
            ...bookingForm,
            [id]: value,
        });
    };

    const handleConfirmBooking = (e) => {
        e.preventDefault();
        console.log('Booking Confirmed:', bookingForm);
        alert(`Booking untuk ${bookingForm.walker} telah dibuat!`);
        
        // NAVIGASI KE HALAMAN WAITING CONFIRMATION (Halaman 7)
        navigateTo('waiting'); 
    };

    return (
        <>
            <Header navigateTo={navigateTo} />
            <div className="booking-content-wrap">

            <div className="booking-wrap">
            
            <div className="booking-wrap-title">
                <h2 className="booking-title">Great Choice!!!</h2>
                <p className="booking-subtitle">Now let's fill in some important information of yours</p>
            </div>

            <div className="booking-form-box">
                <form onSubmit={handleConfirmBooking}>
                    
                    <div className="booking-input-group">
                        <label htmlFor="walker">Pet Walker</label>
                        <input type="text" id="walker" value={bookingForm.walker} readOnly />
                    </div>
                    
                    <div className="booking-input-group">
                        <label htmlFor="owner">Pet Owner</label>
                        <input type="text" id="owner" value={bookingForm.owner} readOnly />
                    </div>
                    
                    <div className="booking-input-group">
                        <label htmlFor="phone">Phone</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            value={bookingForm.phone} 
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="booking-input-group">
                        <label htmlFor="address">Address</label>
                        <input 
                            type="text" 
                            id="address" 
                            value={bookingForm.address} 
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="booking-input-group">
                        <label htmlFor="date">Date</label>
                        <input 
                            type="date" 
                            id="date" 
                            value={bookingForm.date} 
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="booking-input-group">
                        <label htmlFor="time">Time</label>
                        <input 
                            type="time" 
                            id="time" 
                            value={bookingForm.time} 
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="booking-input-group">
                        <label htmlFor="duration">Duration (Hours)</label>
                        <input 
                            type="number" 
                            id="duration" 
                            value={bookingForm.duration} 
                            onChange={handleChange}
                            min="1"
                            required 
                        />
                    </div>

                    <button type="submit" className="confirm-booking-button">
                        Confirm Booking
                    </button>
                </form>
            
            </div>
        </div>
    </div>
    </>
    );
}

export default BookingPage;