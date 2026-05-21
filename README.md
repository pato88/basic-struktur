# 🚀 Full-Stack Boilerplate (React-Express-Prisma-MySQL)

Kerangka dasar (boilerplate) aplikasi full-stack yang modular, aman, dan konsisten untuk menunjang produktivitas pengerjaan berbagai proyek web dev.

---

## 🛠️ Tech Stack & Fitur Utama

- **Frontend (FE)**: React.js (Vite) + Tailwind CSS + React Router v6 + Axios Interceptor.
- **Backend (BE)**: Express.js (Modular/Feature-Based) + Prisma ORM (MySQL).
- **Keamanan**: JWT Auth (Access & Refresh Token) + RBAC (Role-Based Access Control) + Helmet Security Headers + Express Rate Limiter.
- **Utilitas Bawaan**:
  - Centralized Error Handler (Anti-crash).
  - Storage Service Wrapper (Local server vs Cloud/Cloudinary).
  - Axios request interceptor (Auto-inject JWT token & redirect login 401).

---

## ⚙️ Persiapan & Instalasi Cepat

Ikuti langkah-langkah berikut untuk menjalankan boilerplate ini di komputer lokal:

### 1. Persiapan Database MySQL
1. Pastikan program database lokal Anda menyala (seperti XAMPP, Laragon, atau MySQL Standalone).
2. Buat database baru kosong bernama `struktur_apps` (atau sesuaikan namanya).

### 2. Setup Backend Server
1. Buka terminal baru dan masuk ke folder `/backend`.
2. Salin file environment:
   ```bash
   cp .env.example .env
   ```
3. Buka file `.env` yang baru dibuat, lalu sesuaikan username & password database MySQL Anda:
   ```env
   # Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
   DATABASE_URL="mysql://root:@localhost:3306/struktur_apps"
   ```
4. Jalankan perintah migrasi skema tabel database ke MySQL lokal:
   ```bash
   npm run db:migrate
   ```
5. Jalankan perintah seeder untuk menginisiasi default roles & user superadmin pertama:
   ```bash
   npm run db:seed
   ```
6. Jalankan dev server backend:
   ```bash
   npm run dev
   ```
   *Backend server sekarang berjalan di port `http://localhost:5000`.*

### 3. Setup Frontend Client
1. Buka terminal baru dan masuk ke folder `/frontend`.
2. Salin file environment:
   ```bash
   cp .env.example .env
   ```
3. Jalankan dev server frontend:
   ```bash
   npm run dev
   ```
   *Frontend dev server sekarang berjalan di port `http://localhost:5173`.*

---

## 🔑 Kredensial Default Akun Login (Hasil Seed)

Setelah menjalankan `npm run db:seed` di backend, Anda dapat masuk ke aplikasi dengan akun superadmin berikut:
- **Email**: `admin@mail.com`
- **Password**: `password123`

---

## 📁 Struktur Perintah Command Terminal

| Lokasi Folder | Perintah Terminal | Kegunaan |
| :--- | :--- | :--- |
| **`/backend`** | `npm run dev` | Menjalankan API backend dengan live-reload (nodemon) |
| **`/backend`** | `npm run db:migrate` | Membuat tabel & sinkronisasi skema database ke MySQL |
| **`/backend`** | `npm run db:seed` | Mengisi data default user superadmin & master roles |
| **`/frontend`** | `npm run dev` | Menjalankan dev server frontend React Vite |
| **`/frontend`** | `npm run build` | Membuat bundle optimasi production frontend di `/dist` |

---

## 📈 Pengembangan Fitur Baru Selanjutnya
Untuk menambah modul fitur bisnis baru (misalnya fitur `Product`), ikuti pola modular berikut:

1. **Di Backend**:
   - Definisikan tabel `Product` di `backend/prisma/schema.prisma` lalu jalankan `npm run db:migrate`.
   - Buat folder modul baru: `backend/src/modules/product/`.
   - Buat file `product.service.js` (logika query database), `product.controller.js` (validasi input & response), dan `product.routes.js` (URL endpoint).
   - Daftarkan route baru tersebut di file utama `backend/src/app.js`.

2. **Di Frontend**:
   - Buat file page `frontend/src/pages/ProductManagement.jsx`.
   - Daftarkan rute baru di `frontend/src/routes/index.jsx` dengan tingkat proteksi role yang Anda kehendaki.
