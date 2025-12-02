# 🚀 CARA SETUP PROJECT PAWTIME (Untuk Teman Tim)

## ⚠️ PENTING: Backend & Frontend Harus Running Bersamaan!

---

## 📋 PREREQUISITES

1. **Node.js** (v18 atau lebih baru)
2. **Git** installed
3. **Backend Repository** sudah di-clone

---

## 🔧 SETUP STEP-BY-STEP

### **STEP 1: Clone & Install Frontend**

```bash
# Clone repository
git clone https://github.com/AdilBusra/FrontEnd_PawTime_TerlaluAdil.git
cd FrontEnd_PawTime_TerlaluAdil

# Checkout branch yang benar
git checkout tein-indomie

# Install dependencies
npm install
```

---

### **STEP 2: Setup Environment Variables**

Buat file `.env` di root folder:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_SUPABASE_URL=https://sulowvksnrfufmmthsar.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bG93dmtzbnJmdWZtbXRoc2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzM3NjIsImV4cCI6MjA3OTY0OTc2Mn0.h5Ixb63j-4unqlCzbESvk7nSt2KnLeVTlewYLUYllwc
```

⚠️ **File ini sudah ada, tapi pastikan formatnya benar (pakai `=` bukan `:`)!**

---

### **STEP 3: Setup & Run Backend** ⚠️ **WAJIB!**

**Backend harus running sebelum frontend!**

```bash
# Di terminal baru, masuk ke folder backend
cd ../backend-pawtime  # Sesuaikan nama folder backend

# Install dependencies
npm install

# Setup database (jika belum)
# Buat database PostgreSQL di lokal atau pakai Supabase

# Run migrations (jika ada)
npm run migrate
# atau
npx sequelize-cli db:migrate

# Start backend server
npm start
# atau
npm run dev
```

**Backend harus jalan di http://localhost:5000** ✅

Cek di browser: http://localhost:5000 (seharusnya ada response, tidak boleh "Cannot GET /")

---

### **STEP 4: Run Frontend**

**Di terminal baru** (backend tetap jalan!):

```bash
# Masuk ke folder frontend
cd FrontEnd_PawTime_TerlaluAdil

# Run development server
npm run dev
```

Frontend akan buka di: **http://localhost:5173**

---

## ✅ VERIFIKASI SETUP SUKSES

### 1. Check Backend Running:
```bash
# Buka browser atau Postman, test endpoint ini:
GET http://localhost:5000/api/walkers
# Seharusnya return array walkers (bisa kosong [])
```

### 2. Check Frontend Running:
```
Buka http://localhost:5173
Landing page seharusnya muncul
```

### 3. Test Integration:
```
1. Klik "Get Started" di landing page
2. Coba Register user baru
3. Jika berhasil → Setup sukses! ✅
4. Jika error "Network Error" → Backend belum running ❌
```

---

## 🐛 TROUBLESHOOTING

### ❌ Error: "Network Error" saat register/login

**Penyebab:** Backend tidak running atau port salah

**Solusi:**
```bash
# Cek apakah backend running:
# Windows PowerShell:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Jika tidak ada output = backend tidak running!
# Jalankan backend dulu (lihat Step 3)
```

---

### ❌ Error: "Port 5173 already in use"

**Solusi:**
```bash
# Kill process di port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
kill -9 $(lsof -t -i:5173)

# Atau ubah port di vite.config.js:
# server: { port: 5174 }
```

---

### ❌ Error: "Cannot find module"

**Solusi:**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Error: CORS blocked

**Solusi di Backend:**
```javascript
// backend/server.js atau app.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
```

---

## 📁 STRUKTUR PROJECT

```
pawtime-fe/
├── FrontEnd_PawTime_TerlaluAdil/  ← Frontend (Anda di sini)
│   ├── src/
│   ├── .env                        ← Environment variables
│   ├── package.json
│   └── vite.config.js
│
└── backend-pawtime/                ← Backend (harus running!)
    ├── server.js
    ├── .env
    └── package.json
```

---

## 🎯 CHECKLIST SEBELUM MULAI KERJA

- [ ] Backend running di http://localhost:5000
- [ ] Frontend running di http://localhost:5173
- [ ] File `.env` sudah ada dan benar
- [ ] Test register/login sukses (tidak ada Network Error)
- [ ] Database connected (cek backend logs)

---

## 🆘 MASIH ERROR?

### Share info ini di grup:

1. **Screenshot error** (full error message)
2. **Backend logs** (output terminal backend)
3. **Frontend logs** (output terminal frontend + browser console)
4. **Environment:**
   - OS: Windows/Mac/Linux
   - Node version: `node -v`
   - Port backend: (default 5000)

---

## 📞 CONTACT

Jika ada masalah setup, hubungi:
- **GitHub Issues:** https://github.com/AdilBusra/FrontEnd_PawTime_TerlaluAdil/issues
- **WhatsApp Grup:** [Link grup]

---

**Happy Coding! 🚀**
