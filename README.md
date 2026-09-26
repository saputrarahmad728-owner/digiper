# 🌱 Tanya Tani - Platform Tanya Jawab & Konsultasi Pertanian Modern

**Tanya Tani** adalah aplikasi web modern bertema pertanian yang menghubungkan petani di seluruh Indonesia dengan para pakar agronomi, peneliti proteksi tanaman, dan praktisi budidaya.

Dibangun dengan antarmuka yang bersih, responsif (sempurna di HP maupun laptop), serta nuansa warna hijau khas pertanian Indonesia.

---

## ✨ Fitur-Fitur Utama yang Tersedia

1. **Header / Navbar Responsif**
   - Logo bertema pertanian dengan ikon tunas tanaman modern.
   - Menu navigasi cepat (*Beranda*, *Tanya Ahli*, *Komunitas*, *Artikel*).
   - Indikator koneksi database Supabase secara *real-time*.
   - Tombol utama **"Mulai Bertanya"** yang langsung mengarahkan ke form konsultasi.
   - Menu hamburger untuk tampilan ponsel / layar kecil.

2. **Hero Section Dinamis**
   - Headline memikat: *"Solusi Cepat untuk Masalah Pertanian Anda"*.
   - **Search Bar Cepat**: Mencari solusi kasus hama, jamur, pupuk, atau bibit secara instan (*live filtering*).
   - *Quick suggestion chips* (pencarian populer: Daun cabai keriting, Pupuk kohe kambing, Tip burn selada, dll).
   - Statistik dampak pertanian (3.400+ kasus terjawab, 85+ pakar aktif).

3. **Kategori Cepat (Quick Tags)**
   - Badge/pill interaktif: `#HamaTanaman`, `#PupukOrganik`, `#Hidroponik`, `#Pascapanen`, `#BibitUnggul`.
   - Menampilkan jumlah kasus per kategori dan menyaring daftar konsultasi saat diklik.

4. **Fitur Utama - Kolom Konsultasi & Tanya Jawab**
   - **Formulir Input Kasus Tani**: Petani dapat mengisi nama, daerah, komoditas tanaman, kategori masalah, tingkat urgensi (*Rendah, Sedang, Mendesak*), judul, dan rincian gejala lapangan.
   - **Daftar Pertanyaan Populer**: Menampilkan kartu-kartu kasus tani nyata lengkap dengan identitas petani, jenis tanaman, dan cuplikan respon pakar.
   - **Modal "Lihat Jawaban"**: Jendela modal interaktif yang menampilkan diagnosa lengkap dari pakar terverifikasi (IPB, BPTP, dll), **daftar langkah penanganan teknis di lapangan**, dan tombol jempol (*Bermanfaat*) yang terhubung ke database.

5. **Pakar Tani & Pustaka Budidaya**
   - Profil agronomis terverifikasi beserta keahlian dan rating.
   - Tips praktis mingguan untuk pencegahan hama di musim hujan.
   - Koleksi artikel panduan budidaya pertanian berkelanjutan.

---

## 📁 Struktur Berkas Proyek

```text
tugas digiper/
├── .env.example            # Contoh konfigurasi Supabase
├── index.html              # Entry HTML utama untuk Vite & Vercel
├── preview.html            # File mandiri (Single-File) untuk langsung dilihat di browser
├── package.json            # Daftar dependensi (React 18, Supabase JS, Lucide, TypeScript)
├── supabase_schema.sql     # Skrip SQL lengkap (Tabel, RLS Policy, & Data Sampel)
├── tsconfig.json           # Konfigurasi kompilator TypeScript
├── tsconfig.node.json
├── vercel.json             # Konfigurasi routing SPA untuk Vercel
├── vite.config.ts          # Konfigurasi build Vite
└── src/
    ├── App.tsx             # Komponen inti aplikasi & manajemen state
    ├── index.css           # Design system warna hijau pertanian & CSS responsif
    ├── main.tsx            # Root mounting React
    ├── types.ts            # Tipe data TypeScript (Question, Answer, Category, dll)
    ├── components/
    │   ├── Navbar.tsx          # Navigasi & status koneksi
    │   ├── Hero.tsx            # Hero section & pencarian
    │   ├── QuickTags.tsx       # Pill badges kategori
    │   ├── AskForm.tsx         # Formulir tanya-jawab petani
    │   ├── QuestionCard.tsx    # Kartu pertanyaan & cuplikan jawaban
    │   ├── AnswerModal.tsx     # Modal detail jawaban pakar & langkah teknis
    │   ├── Sidebar.tsx         # Pakar terverifikasi & tips mingguan
    │   ├── ArticlesSection.tsx # Artikel edukasi pertanian
    │   ├── Footer.tsx          # Footer informatif
    │   └── SupabaseModal.tsx   # Panduan konfigurasi Supabase dalam aplikasi
    └── lib/
        └── supabase.ts     # Client Supabase dengan fallback LocalStorage otomatis
```

---

## 🚀 Panduan Lengkap: Cara Menghubungkan Supabase & Hosting di Vercel

### LANGKAH 1: Setup Database di Supabase (Gratis)

1. Buka situs [supabase.com](https://supabase.com) dan buat akun (bisa login dengan akun GitHub).
2. Klik tombol **"New Project"**, pilih organisasi Anda.
3. Beri nama proyek: `tanya-tani-db`, buat password database yang kuat, dan pilih region terdekat (misal: *Singapore*). Klik **"Create new project"**.
4. Tunggu sekitar 1–2 menit hingga database selesai disiapkan.
5. Pada menu samping kiri dashboard Supabase, klik **SQL Editor** (ikon terminal/dokumen).
6. Buka file [`supabase_schema.sql`](./supabase_schema.sql) dari proyek ini, salin seluruh kodenya, lalu tempelkan ke SQL Editor Supabase.
7. Klik tombol **"Run"** (berwarna hijau).
   > *Tabel `questions` dan `answers`, kebijakan keamanan Row Level Security (RLS), serta 4 data kasus nyata cabai, pupuk organik, selada hidroponik, dan jagung akan otomatis terbuat!*
8. Buka menu **Project Settings** (ikon roda gigi di pojok kiri bawah) > pilih **API**.
9. Salin dua nilai penting berikut:
   - **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - **Project API keys** bagian `anon` / `public` (contoh: `eyJhbGciOiJIUzI1NiIsInR5...`)

---

### LANGKAH 2: Menguji Coba di Komputer Lokal

#### Opsi A: Langsung Buka Preview (Tanpa Install Apapun)
Anda bisa langsung membuka file [`preview.html`](./preview.html) dengan cara klik ganda (double-click) di File Explorer. Halaman web langsung berjalan lengkap dengan interaktivitas dan styling.

#### Opsi B: Menggunakan Node.js & Vite (TypeScript)
1. Pastikan Anda telah menginstal **Node.js LTS** dari [nodejs.org](https://nodejs.org).
2. Buka Terminal / PowerShell di folder proyek ini:
   ```bash
   # 1. Pasang dependensi
   npm install

   # 2. Buat file .env dari template
   copy .env.example .env
   ```
3. Buka file `.env` dan masukkan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=token-anon-key-anda
   ```
4. Jalankan server lokal:
   ```bash
   npm run dev
   ```
5. Buka alamat `http://localhost:3000` di browser Anda!

---

### LANGKAH 3: Hosting Aplikasi ke Vercel (Gratis & Online 24 Jam)

Vercel adalah platform hosting cloud terbaik untuk aplikasi modern berbasis Vite dan TypeScript.

#### Cara Termudah (Melalui GitHub & Vercel Dashboard):

1. **Unggah Proyek ke GitHub**:
   - Buat akun di [github.com](https://github.com) jika belum punya.
   - Buat repositori baru bernama `tanya-tani` (atur sebagai *Public* atau *Private*).
   - Unggah seluruh berkas proyek ini ke repositori tersebut (bisa menggunakan *GitHub Desktop*, git command line, atau fitur *Upload files* di web GitHub).

2. **Hubungkan ke Vercel**:
   - Buka [vercel.com](https://vercel.com) dan klik **"Sign Up"** atau **"Log In"** menggunakan akun **GitHub** Anda.
   - Di dashboard Vercel, klik tombol **"Add New..."** lalu pilih **"Project"**.
   - Pada bagian *Import Git Repository*, pilih repositori `tanya-tani` yang baru saja Anda buat, lalu klik **"Import"**.

3. **Konfigurasi Build & Environment Variables di Vercel**:
   - Vercel akan otomatis mengenali framework **Vite** dan mengatur:
     - *Build Command*: `npm run build`
     - *Output Directory*: `dist`
   - Buka accordion **Environment Variables** sebelum klik deploy:
     - Masukkan Key: `VITE_SUPABASE_URL` | Value: *(URL Supabase Anda)*
     - Masukkan Key: `VITE_SUPABASE_ANON_KEY` | Value: *(Anon Key Supabase Anda)*
     - Klik **"Add"**.

4. **Klik "Deploy"**:
   - Klik tombol **"Deploy"**. Vercel akan mengunduh kode, mengompilasi TypeScript, dan merilisnya ke internet dalam waktu kurang dari 1 menit.
   - Setelah selesai, Anda akan mendapatkan tautan website resmi publik (contoh: `https://tanya-tani.vercel.app`) yang siap dibagikan kepada petani dan kelompok tani!

---

## 🛡️ Fallback Mode (Keamanan & Keandalan)

Aplikasi ini dilengkapi fitur **Smart Fallback**:
- Jika environment variable Supabase belum diisi atau sedang offline, aplikasi **tidak akan error atau blank**, melainkan beralih otomatis ke **Mode Demo**.
- Data konsultasi baru yang diinput petani akan tersimpan rapi di *LocalStorage* peramban.
- Begitu Supabase dikonfigurasi, sistem otomatis beralih menggunakan database cloud PostgreSQL Supabase secara real-time!
