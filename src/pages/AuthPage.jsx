// src/pages/AuthPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";

// MODIFIKASI: Menerima setLoggedInUserRole dari App.jsx
function AuthPage({ navigateTo, setLoggedInUserRole, userRole }) { 
  const [activeTab, setActiveTab] = useState("login");

  // STATE DAN HANDLER FORM
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    number: "", 
    email: "",
    password: "",
    role: "owner", 
  });

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginForm((prevForm) => ({ ...prevForm, [id]: value }));
  };
  const handleRegisterChange = (e) => {
    const { id, value, name, type, checked } = e.target;
    setRegisterForm((prevForm) => ({
      ...prevForm,
      [name || id]: type === "radio" && !checked ? prevForm[name] : value,
    }));
  };

  // HANDLER SUBMIT
  const handleFormSubmit = (e) => {
      e.preventDefault(); 
      
      if (activeTab === 'login') {
          console.log('Data Login Terkumpul:', loginForm);
          alert(`Mencoba Login dengan Email: ${loginForm.email}. Siap dikirim ke Backend!`);
          // Di sini nanti logika sukses login akan navigateTo('account')
      } else {
          // Logika untuk Registration
          console.log('Data Register Terkumpul:', registerForm);
          alert(`Registrasi berhasil! Anda akan diarahkan ke halaman setup.`);

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
  const buttonClass = activeTab === "login" ? "login-button" : "registration-button";
  
  const renderWelcomeText = () => {
    if (activeTab === 'login') {
      return (
        <div className="welcome-text-content">
          <h2 className="welcome-heading">Welcome Back 🐶😺</h2>
          <p className="welcome-subtext">We missed you! Your pets are waiting</p>
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
  
  const renderFormContent = () => {
    if (activeTab === 'login') {
      return (
        <div className="form-inner-content">
          <div className="input-group-auth">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={loginForm.email} onChange={handleLoginChange} />
          </div>
          <div className="input-group-auth">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={loginForm.password} onChange={handleLoginChange} />
          </div>
        </div>
      );
    }
    
    // Tampilan Registration
    return (
      <div className="form-inner-content registration-form-inner">
        <div className="input-group-auth">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={registerForm.name} onChange={handleRegisterChange} />
        </div>
        <div className="input-group-auth">
          <label htmlFor="number">No Number</label>
          <input
            type="tel"
            id="number"
            value={registerForm.number}
            onChange={handleRegisterChange}
          />
        </div>
        <div className="input-group-auth">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={registerForm.email} onChange={handleRegisterChange} />
        </div>
        <div className="input-group-auth">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={registerForm.password} onChange={handleRegisterChange} />
        </div>
        
        {/* Radio Button untuk Role */}
        <div className="role-selection">
          <label>
            <input type="radio" name="role" value="owner" checked={registerForm.role === 'owner'} onChange={handleRegisterChange} /> Pet Owner
          </label>
          <label>
            <input type="radio" name="role" value="walker" checked={registerForm.role === 'walker'} onChange={handleRegisterChange} /> Pet Walker
          </label>
        </div>
      </div>
    );
  };


  return (
    <div className="auth-page-container">
   <Header navigateTo={navigateTo} userRole={userRole} />
      
      <div className="auth-content-main">
        
        {/* KIRI: Teks Sambutan */}
        {renderWelcomeText()}

        {/* KANAN: Kotak Formulir Utama (INI ADALAH MARKUP YANG PALING SERING HILANG!) */}
        <div className="auth-form-box">
          
          {/* Tabs Navigation */}
          <div className="tab-nav">
            <button 
              className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Login
            </button>
            <button 
              className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Registration
            </button>
          </div>
          
          {/* Konten Formulir */}
          <div className={`form-container ${activeTab === 'login' ? 'login-bg' : 'register-bg'}`}>
            <form onSubmit={handleFormSubmit}>
              {renderFormContent()}
              
              {/* Tombol Utama */}
              <button type="submit" className={`auth-main-button ${buttonClass}`}>
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