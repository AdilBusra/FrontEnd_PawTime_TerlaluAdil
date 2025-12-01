// src/pages/AuthPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";

function AuthPage({ navigateTo }) {
  const [activeTab, setActiveTab] = useState("login");

  // 1. STATE UNTUK MENYIMPAN DATA LOGIN
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // 2. STATE UNTUK MENYIMPAN DATA REGISTRATION
  const [registerForm, setRegisterForm] = useState({
    name: "",
    number: "", // No Number
    email: "",
    password: "",
    role: "owner", // Default role
  });

  // 3. HANDLER UNTUK PERUBAHAN INPUT LOGIN
  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginForm((prevForm) => ({
      ...prevForm, // Salin semua state lama
      [id]: value, // Timpa hanya nilai yang diubah (id = email atau password)
    }));
  };

  // 4. HANDLER UNTUK PERUBAHAN INPUT REGISTRATION
  const handleRegisterChange = (e) => {
    const { id, value, name, type, checked } = e.target;

    setRegisterForm((prevForm) => ({
      ...prevForm,
      // Jika radio button, gunakan 'name' (role), jika input biasa, gunakan 'id'
      [name || id]: type === "radio" && !checked ? prevForm[name] : value,
    }));
  };

  // 5. HANDLER SAAT FORM DI-SUBMIT
  const handleFormSubmit = (e) => {
      e.preventDefault(); 
      
      if (activeTab === 'login') {
          console.log('Data Login Terkumpul:', loginForm);
      } else {
          // Logika untuk Registration
          console.log('Data Register Terkumpul:', registerForm);

          // PENTING: Arahkan ke halaman setup profil walker setelah Register
          if (registerForm.role === 'walker') {
              navigateTo('walkerSetup'); // <-- NAVIGASI KE HALAMAN SETUP WALKER
          } else {
              // PENTING: Jika Pet Owner, arahkan ke halaman setup Pet Owner
              navigateTo('ownerSetup'); // <-- NAVIGASI KE HALAMAN SETUP OWNER
          }
      }
  };

  const buttonText = activeTab === "login" ? "Login" : "Registration";

  // 2. Class spesifik tombol (yang dicari oleh React)
  const buttonClass =
    activeTab === "login" ? "login-button" : "registration-button";

  // Fungsi untuk beralih tab
  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  // Fungsi untuk merender teks sambutan di kiri
  const renderWelcomeText = () => {
    if (activeTab === "login") {
      return (
        <div className="welcome-text-content">
          <h2 className="welcome-heading">Welcome Back 🐶😺</h2>
          <p className="welcome-subtext">
            We missed you! Your pets are waiting
          </p>
        </div>
      );
    }
    return (
      <div className="welcome-text-content">
        <h2 className="welcome-heading">First Timer? 😍</h2>
        <p className="welcome-subtext">
          Ready to book a Walker or become one?
        </p>
      </div>
    );
  };

  // Fungsi untuk merender konten formulir di dalam kotak biru tua
  const renderFormContent = () => {
    // ... (Logika renderWelcomeText tetap sama) ...

    if (activeTab === "login") {
      return (
        <div className="form-inner-content">
          <div className="input-group-auth">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={loginForm.email} // <-- STATE SEBAGAI VALUE
              onChange={handleLoginChange} // <-- PANGGIL HANDLER
            />
          </div>
          <div className="input-group-auth">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={loginForm.password} // <-- STATE SEBAGAI VALUE
              onChange={handleLoginChange} // <-- PANGGIL HANDLER
            />
          </div>
        </div>
      );
    }

    // Tampilan Registration
    return (
      <div className="form-inner-content registration-form-inner">
        {/* ... (Tiap input harus memiliki prop value dan onChange) ... */}
        <div className="input-group-auth">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={registerForm.name}
            onChange={handleRegisterChange}
          />
        </div>
        <div className="input-group-auth">
          <label htmlFor="number">Phone No.</label>
          <input
            type="tel"
            id="number"
            value={registerForm.number}
            onChange={handleRegisterChange}
          />
        </div>
        <div className="input-group-auth">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={registerForm.email}
            onChange={handleRegisterChange}
          />
        </div>
        <div className="input-group-auth">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={registerForm.password}
            onChange={handleRegisterChange}
          />
        </div>

        {/* Radio Button untuk Role */}
        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="owner"
              checked={registerForm.role === "owner"} // Controlled radio button
              onChange={handleRegisterChange}
            />{" "}
            Pet Owner
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="walker"
              checked={registerForm.role === "walker"} // Controlled radio button
              onChange={handleRegisterChange}
            />{" "}
            Pet Walker
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="auth-page-container">
      <Header navigateTo={navigateTo} />

      <div className="auth-content-main">
        {renderWelcomeText()}

        <div className="auth-form-box">
          {/* ... Tabs Navigation ... */}
          <div className="tab-nav">
            <button
              className={`tab-button ${activeTab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-button ${
                activeTab === "registration" ? "active" : ""
              }`}
              onClick={() => switchTab("registration")}
            >
              Registration
            </button>
          </div>

          <div
            className={`form-container ${
              activeTab === "login" ? "login-bg" : "register-bg"
            }`}
          >
            {/* PENTING: Tambahkan onSubmit handler di tag form */}
            <form onSubmit={handleFormSubmit}>
              {renderFormContent()}

              <button
                type="submit"
                className={`auth-main-button ${buttonClass}`}
              >
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
