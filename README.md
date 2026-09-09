# MoSAT - Digital SAT Independent Preparation Lab (1500–1600 Target)

MoSAT adalah aplikasi lab mandiri persiapan Digital SAT yang dirancang untuk mencapai target skor 1500–1600. Dilengkapi dengan bank soal asli College Board, simulasi ujian dengan antarmuka Bluebook, integrasi kalkulator Desmos, bedah kosakata kontekstual, Buku Dosa (reviu kesalahan terarah), dan sinkronisasi Cloud Firestore.

---

## Fitur Utama

1. **Simulasi SAT (Full Adaptive Engine & Bluebook UI)**
   - Struktur 2 Modul Reading & Writing (27 soal x 2, total 64 menit) dan 2 Modul Math (22 soal x 2, total 70 menit).
   - Penilaian adaptif: Modul 2 disesuaikan (Easy vs Hard) dengan konversi tabel skor College Board (200–800 RW, 200–800 Math).
   - Timer countdown, anotasi soal, flag for review, navigasi grid soal, dan jeda istirahat 10 menit.

2. **Bank Soal Lengkap (2.881+ Soal College Board)**
   - Mencakup seluruh domain SAT: *Information and Ideas*, *Craft and Structure*, *Expression of Ideas*, *Standard English Conventions*, *Algebra*, *Advanced Math*, *Problem Solving and Data Analysis*, dan *Geometry and Trigonometry*.
   - Filter berdasarkan domain, skill, tingkat kesulitan (Easy, Medium, Hard), serta pencarian kata kunci.

3. **Floating Desmos Graphing Calculator**
   - Menggunakan Desmos API resmi (calculator-1.11.min.js).
   - Jendela kalkulator non-blocking, dapat digeser (*draggable*), dan disematkan (*dockable*) tanpa menghalangi teks soal SAT Math.
   - Dilengkapi lembar rumus resmi Digital SAT (*Math Reference Sheet*).

4. **Bedah Kosakata (Vocabulary Hub)**
   - 70 entri kosakata frekuensi tinggi SAT dengan arti kontekstual yang disederhanakan (*simplified meaning*) dan kalimat contoh dari teks soal SAT asli.
   - Mode flashcard interaktif dengan pelacakan tingkat penguasaan (*New*, *Learning*, *Mastered*).

5. **Buku Dosa & Analisis Kesalahan**
   - Pencatatan otomatis setiap soal yang salah dari simulasi dan drill.
   - Taksonomi kesalahan: *Kelemahan Konsep*, *Kecerobohan (Careless)*, *Manajemen Waktu*, dan *Salah Baca Soal*.
   - Fitur latihan ulang (*re-attempt*) untuk memastikan pemahaman sebelum melanjutkan.

6. **Autentikasi & Sinkronisasi Cloud (Firebase Firestore)**
   - Terintegrasi dengan Firebase project mosat-5dc4f.
   - Mendukung Google Sign-In dan Email/Password dengan fallback *offline-first* (LocalStorage).
   - Sinkronisasi real-time dua arah untuk profil, riwayat skor simulasi, dan data Buku Dosa.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (DSAT16 Warm Yellow-Orange palette)
- **Icons**: Lucide React
- **Math & Chemistry Rendering**: KaTeX
- **Graphing Engine**: Official Desmos Graphing Calculator API
- **Backend & Database**: Firebase Authentication, Google OAuth, Cloud Firestore
- **Deployment**: Netlify (SPA rewrite configuration via 
etlify.toml)

---

## Persiapan & Menjalankan Lokal

### 1. Kloning Repositori
`ash
git clone https://github.com/Mangroove7/MoSAT.git
cd MoSAT
`

### 2. Pasang Dependensi
`ash
npm install
`

### 3. Konfigurasi Lingkungan (.env.local)
Salin .env.example menjadi .env.local:
`ash
cp .env.example .env.local
`

Isi variabel konfigurasi dari [Firebase Console (mosat-5dc4f)](https://console.firebase.google.com/u/0/project/mosat-5dc4f/settings/general/):
`env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=mosat-5dc4f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mosat-5dc4f
VITE_FIREBASE_STORAGE_BUCKET=mosat-5dc4f.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...:web:...
`

### 4. Menjalankan Server Pengembangan
`ash
npm run dev
`

### 5. Membangun untuk Produksi
`ash
npm run build
`

---

## Deployment ke Netlify

Aplikasi ini telah dikonfigurasi untuk continuous deployment di Netlify:

1. **Koneksi Git**:
   - Buka dashboard [Netlify MoSAT Overview](https://app.netlify.com/projects/mo-sat/overview).
   - Hubungkan ke repositori GitHub: Mangroove7/MoSAT.
   - Branch: main.

2. **Pengaturan Build (Otomatis via 
etlify.toml)**:
   - **Build command**: 
pm run build
   - **Publish directory**: dist
   - **Redirects**: /* -> /index.html 200 (SPA routing)

3. **Environment Variables di Netlify**:
   - Buka **Site configuration** > **Environment variables**.
   - Tambahkan variabel Firebase berikut:
     - VITE_FIREBASE_API_KEY
     - VITE_FIREBASE_AUTH_DOMAIN (mosat-5dc4f.firebaseapp.com)
     - VITE_FIREBASE_PROJECT_ID (mosat-5dc4f)
     - VITE_FIREBASE_STORAGE_BUCKET (mosat-5dc4f.appspot.com)
     - VITE_FIREBASE_MESSAGING_SENDER_ID
     - VITE_FIREBASE_APP_ID

---

## Lisensi & Hak Cipta Soal

Soal latihan bersumber dari materi publik College Board Educator Question Bank dan SAT Question Bank untuk kepentingan studi akademik persiapan mandiri. Hak cipta merek SAT dan Bluebook dimiliki oleh College Board.
