# 🔧 TROUBLESHOOTING GUIDE

## ❌ ERROR: "Network Error" atau "Connection Refused" pada localhost:5000

### PENYEBAB:
File `.env` tidak ter-load dengan benar, sehingga aplikasi menggunakan fallback URL `http://localhost:5000` padahal backend ada di Ngrok.

---

## ✅ SOLUSI LENGKAP:

### **STEP 1: Pastikan File `.env` Ada & Benar**

1. Cek apakah file `.env` ada di root folder (sejajar dengan `package.json`)
2. Buka file `.env` dan pastikan isinya seperti ini:

```env
VITE_API_URL=https://predoubtful-nonincorporated-tonia.ngrok-free.dev
VITE_SOCKET_URL=https://predoubtful-nonincorporated-tonia.ngrok-free.dev
VITE_SUPABASE_URL=https://sulowvksnrfufmmthsar.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bG93dmtzbnJmdWZtbXRoc2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzM3NjIsImV4cCI6MjA3OTY0OTc2Mn0.h5Ixb63j-4unqlCzbESvk7nSt2KnLeVTlewYLUYllwc
```

⚠️ **PENTING:** 
- Tidak ada spasi sebelum/sesudah `=`
- Tidak ada tanda kutip (`"`) di sekitar URL
- File harus bernama `.env` (pakai titik di depan)

---

### **STEP 2: Hapus Cache Vite**

Vite menyimpan cache environment variables. Hapus cache-nya:

```bash
# Windows PowerShell:
Remove-Item -Recurse -Force node_modules\.vite

# Linux/Mac:
rm -rf node_modules/.vite
```

---

### **STEP 3: Restart Dev Server**

1. **Stop** dev server (Ctrl+C di terminal)
2. **Start** lagi:

```bash
npm run dev
```

---

### **STEP 4: Cek Console Browser**

1. Buka browser (Chrome/Edge)
2. Tekan `F12` untuk buka DevTools
3. Lihat tab **Console**
4. Cari log yang seperti ini:

```
🔧 API Configuration:
📍 BASE_URL: https://predoubtful-nonincorporated-tonia.ngrok-free.dev
🌍 VITE_API_URL from env: https://predoubtful-nonincorporated-tonia.ngrok-free.dev
```

**Jika BASE_URL masih `http://localhost:5000`**, berarti `.env` belum ter-load!

---

### **STEP 5: Verify .env File di Terminal**

Cek isi file `.env` langsung di terminal:

```bash
# Windows PowerShell:
Get-Content .env

# Linux/Mac:
cat .env
```

Pastikan output-nya benar!

---

## 🔍 DEBUGGING CHECKLIST:

- [ ] File `.env` ada di root folder (sejajar dengan `package.json`)
- [ ] Isi `.env` sudah benar (URL Ngrok, tidak ada typo)
- [ ] Sudah hapus `node_modules/.vite`
- [ ] Sudah restart dev server (`npm run dev`)
- [ ] Sudah clear browser cache (Ctrl+Shift+Del)
- [ ] Console browser menunjukkan BASE_URL yang benar
- [ ] Backend Ngrok URL masih aktif (coba akses di browser)

---

## 🆘 JIKA MASIH ERROR:

### **Opsi A: Pakai Backend Lokal**

Jika Ngrok bermasalah, setup backend lokal:

1. Clone repository backend
2. Install dependencies: `npm install`
3. Setup database & `.env` backend
4. Run backend: `npm start` (akan jalan di `http://localhost:5000`)
5. Di frontend, ubah `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### **Opsi B: Minta URL Ngrok Baru**

Ngrok URL kadang expire. Minta teman yang punya backend:

1. Restart Ngrok: `ngrok http 5000`
2. Copy URL baru (contoh: `https://abc123.ngrok-free.app`)
3. Update `.env` di frontend dengan URL baru
4. Restart dev server

---

## 📞 KONTAK BANTUAN:

Jika masih stuck, kirim screenshot dari:
1. Isi file `.env` (sensor jika ada secret key)
2. Console browser (tab Console di DevTools)
3. Terminal error message

---

**Last Updated:** December 2, 2025
