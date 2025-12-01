// src/pages/AccountPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import { petWalkers } from "../data/mockData";

// Data Dummy Akun
const DUMMY_USER_INFO = {
  name: "Adil Busra",
  joined: "2024-05-01",
  totalOrders: 15,
};

// ==============================================
// 1. Komponen: DASHBOARD UNTUK WALKER
// ==============================================
const WalkerDashboard = ({ info, navigateTo }) => {
  const newOrders = [
    {
      id: 101,
      petName: "Buddy (Anjing)",
      service: "Walk - 1 Jam",
      status: "New",
      date: "2025-11-23",
    },
    {
      id: 102,
      petName: "Luna (Kucing)",
      service: "Sitting - 4 Jam",
      status: "New",
      date: "2025-11-23",
    },
  ];

  return (
    <div className="walker-dashboard">
      <h2 className="dashboard-welcome">👋 Welcome Back, {info.name}!</h2>
      <p>Role: WALKER | Bergabung Sejak: {info.joined}</p>

      <div className="stats-grid">
        <div className="stat-card total-orders">
          <h3>Total Orders Selesai</h3>
          <p>{info.totalOrders}</p>
        </div>
        <div className="stat-card orders-new">
          <h3>Orders Baru Menunggu</h3>
          <p>{newOrders.length}</p>
        </div>
      </div>

      <h3 className="section-title">Orderan Baru</h3>
      <div className="orders-list">
        {newOrders.map((order) => (
          <div key={order.id} className="order-item new">
            <p>
              <strong>{order.petName}</strong> ({order.service}) - {order.date}
            </p>
            <button className="order-button accept">Terima</button>
            <button className="order-button reject">Tolak</button>
          </div>
        ))}
      </div>

      <h3 className="section-title">Profil Anda</h3>
      <button
        className="edit-profile-button"
        onClick={() => navigateTo("walkerSetup")}
      >
        Edit Deskripsi & Fee
      </button>
    </div>
  );
};

// ==============================================
// 2. Komponen: DASHBOARD UNTUK OWNER
// ==============================================
const OwnerDashboard = ({ info, navigateTo }) => {
  const activeBookings = [
    {
      id: 201,
      walker: "Christella",
      petName: "Shadow",
      service: "Walk - 1 Jam",
      status: "Confirmed",
      date: "2025-11-24",
    },
  ];
  const petData = petWalkers[0]; // Ambil data pet dummy

  return (
    <div className="owner-dashboard">
      <h2 className="dashboard-welcome">👋 Welcome Back, {info.name}!</h2>
      <p>Role: OWNER | Bergabung Sejak: {info.joined}</p>

      <h3 className="section-title">Peliharaan Anda</h3>
      <div className="pet-info-card">
        <p>
          Nama: <strong>{petData.name}</strong>
        </p>
        <p>Jenis: Anjing</p>
        <p>Lokasi: {petData.location}</p>
        <button
          className="edit-profile-button"
          onClick={() => navigateTo("ownerSetup")}
        >
          Edit Detail Peliharaan
        </button>
      </div>

      <h3 className="section-title">Pemesanan Aktif</h3>
      <div className="orders-list">
        {activeBookings.map((booking) => (
          <div key={booking.id} className="order-item active">
            <p>
              Walker: <strong>{booking.walker}</strong> - Pet: {booking.petName}
            </p>
            <p>
              Status: <span className="status-confirmed">{booking.status}</span>
            </p>
            <button className="order-button view">Lihat Detail</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==============================================
// 3. Komponen Utama: ACCOUNT PAGE
// ==============================================
function AccountPage({ navigateTo, userRole }) {
  // Gunakan role yang diterima dari App.jsx. Jika null, kita beri default 'owner' untuk simulasi.
  const actualRole = userRole || "owner";

  const renderDashboard = () => {
    // Logika renderDashboard sekarang memiliki akses ke OwnerDashboard dan WalkerDashboard
    if (actualRole === "walker") {
      return <WalkerDashboard info={DUMMY_USER_INFO} navigateTo={navigateTo} />;
    }
    return <OwnerDashboard info={DUMMY_USER_INFO} navigateTo={navigateTo} />;
  };

  return (
    <div className="account-page-container">
      <Header navigateTo={navigateTo} userRole={userRole} />

      <div className="dashboard-main-content">{renderDashboard()}</div>

      <button
        onClick={() => {
          navigateTo("landing");
        }}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
}

export default AccountPage;
