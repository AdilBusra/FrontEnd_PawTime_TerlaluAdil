# 🚀 Supabase Storage Integration Guide

## Setup yang Sudah Dilakukan

### ✅ 1. Library Installation
- `@supabase/supabase-js` sudah terinstall

### ✅ 2. Supabase Client Configuration
File `src/supabaseClient.js` sudah dibuat dengan:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### ✅ 3. WalkerSetupPage Integration
File `src/pages/WalkerSetupPage.jsx` sudah diupdate dengan:
- `uploadToSupabase(file)` function untuk upload ke bucket `pawtime_bucket`
- `handleSubmit` async dengan try-catch
- Loading state (`isLoading`) untuk disable button saat proses upload
- Unique filename: `Date.now()_filename` (spasi dihilangkan)
- Payload backend: `{ location_name, hourly_rate, bio, photo_url, qris_url }`

---

## 🔧 Setup di Sisi Anda

### Step 1: Verifikasi Bucket Supabase
1. Login ke [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Pergi ke **Storage** → Pastikan bucket `pawtime_bucket` ada dan **Public**
4. Jika belum: Buat bucket baru → Nama: `pawtime_bucket` → Pilih **Public**

### Step 2: Isi Environment Variables di `.env`
Di root project, pastikan file `.env` berisi:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

Cara mendapat credentials:
1. Di dashboard Supabase → Settings → API
2. Copy **Project URL** → paste ke `VITE_SUPABASE_URL`
3. Copy **Anon (public) Key** → paste ke `VITE_SUPABASE_KEY`

### Step 3: Set RLS (Row Level Security) Policy untuk Public Upload
Di Supabase Storage → `pawtime_bucket` → Policies:

**Create Policy untuk Public Upload:**
- Policy name: `Allow public upload`
- Operation: `INSERT`
- For authenticated: `TRUE`
- With: `(true)`

*Atau jika ingin lebih open (development):*
- Operation: `INSERT`, `SELECT`, `UPDATE`, `DELETE`
- For authenticated: `TRUE`
- With: `(true)`

### Step 4: Test Upload
1. Jalankan: `npm run dev`
2. Buka: `http://localhost:5174/setup/walker`
3. Upload foto profil + QRIS
4. Klik Submit
5. Check browser console untuk debug messages
6. Lihat di Supabase Storage apakah file ter-upload

---

## 📋 Flow Upload

```
User klik Submit
    ↓
setIsLoading(true) → tombol jadi "Loading..." & disabled
    ↓
uploadToSupabase(profileForm.photo)
    ↓
Generate unique filename: Date.now() + '_' + filename
    ↓
supabase.storage.from('pawtime_bucket').upload(filePath, file)
    ↓
Get public URL dengan .getPublicUrl()
    ↓
Return photoUrl string
    ↓
Lakukan sama untuk QRIS
    ↓
Prepare payload:
{
  location_name: "Jakarta",
  hourly_rate: 50000,
  bio: "Pengalaman...",
  photo_url: "https://...",
  qris_url: "https://..."
}
    ↓
api.post('/api/walker/setup', payload)
    ↓
✅ Success → alert + navigate to /account
❌ Error → alert error message
    ↓
setIsLoading(false) → tombol kembali normal
```

---

## 🎯 File yang Diupdate

| File | Perubahan |
|------|-----------|
| `src/supabaseClient.js` | ✅ Dibuat (sudah ada) |
| `src/pages/WalkerSetupPage.jsx` | ✅ Ditambah: `uploadToSupabase()`, loading state, async submit |
| `src/api.js` | ✅ Sudah punya header ngrok-skip-browser-warning |
| `.env` | ❌ User harus isi manual |

---

## ✨ Fitur yang Sudah Ada

| Fitur | Status |
|-------|--------|
| 🔐 Environment variable protection | ✅ |
| 📁 Unique filename generation | ✅ |
| 🔗 Public URL generation | ✅ |
| ⏳ Loading state with disabled button | ✅ |
| 🛡️ Try-catch error handling | ✅ |
| 📤 Backend API integration | ✅ |
| 🔄 Navigation after success | ✅ |
| 🖼️ Photo + QRIS upload | ✅ |

---

## 🐛 Troubleshooting

### Error: "VITE_SUPABASE_URL is not defined"
→ Cek `.env` file, pastikan variables sudah diisi

### Error: "Upload gagal: Bucket not found"
→ Cek nama bucket di Supabase, harus `pawtime_bucket`

### Error: "403 Forbidden"
→ Set RLS policy di Supabase Storage untuk allow upload

### File tidak muncul di Supabase Storage
→ Cek browser console error messages
→ Refresh halaman Supabase Storage dashboard

---

## 📝 Testing Checklist

- [ ] `.env` sudah diisi dengan Supabase credentials
- [ ] Bucket `pawtime_bucket` sudah dibuat di Supabase
- [ ] RLS policy sudah set untuk allow upload
- [ ] Aplikasi berjalan (`npm run dev`)
- [ ] Buka `/setup/walker` di browser
- [ ] Upload foto profile (jpg/png)
- [ ] Upload QRIS image
- [ ] Klik Submit
- [ ] Console menampilkan "File uploaded successfully"
- [ ] File muncul di Supabase Storage dashboard
- [ ] Success alert muncul
- [ ] Redirect ke `/account`

---

## 🚀 Ready to Use!

Sekarang upload fitur sudah siap. Tinggal isi `.env` dan test! 🎉
