// src/data/mockData.js

import dewi from '../assets/download(6).jpeg';
import adil from '../assets/download(7).jpeg';
import tein from '../assets/download(8).jpeg';
import chris from '../assets/download(9).jpeg';
import ntah from '../assets/download(10).jpeg';

// Tambahkan detail rating agar bisa dipakai di halaman detail nanti
export const petWalkers = [
    { 
        id: 1, 
        name: "Dewi Fortuna", 
        location: "Medan", 
        image: dewi,
        fee: "Rp 50,000,-", 
        rating: 5,
        description: "Mahasiswa S1 Ilmu Komputer yang mencari pekerjaan freelance di waktu luang. Saya adalah pecinta anjing dan siap merawat serta bermain dengan hewan peliharaan Anda.",
    },
    { 
        id: 2, 
        name: "Adil Busra", 
        location: "Jakarta", 
        image: adil,
        fee: "Rp 45,000,-", 
        rating: 4,
        description: "Pet walker berpengalaman 3 tahun. Mampu menangani anjing besar dan kecil. Area layanan: Jakarta Selatan.",
    },
    { 
        id: 3, 
        name: "Christein", 
        location: "Batam", 
        image: tein,
        fee: "Rp 40,000,-", 
        rating: 4,
        description: "Suka kucing dan anjing. Fokus pada sesi bermain 1-on-1 yang aman dan menyenangkan.",
    },
    { 
        id: 4, 
        name: "Christella", 
        location: "Papua", 
        image: chris,
        fee: "Rp 60,000,-", 
        rating: 5,
        description: "Siap membawa hewan peliharaan Anda jalan-jalan santai sambil menikmati alam Papua.",
    },
];