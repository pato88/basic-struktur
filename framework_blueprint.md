# Kerangka Dasar Aplikasi (Full-Stack Boilerplate Blueprint)

Dokumen ini berisi rangkuman arsitektur, teknologi, dan struktur folder yang disepakati untuk menjadi kerangka dasar (boilerplate) konsisten untuk setiap projek freelance Anda ke depan.

---

## 🚀 1. Tech Stack Utama

| Lapisan | Teknologi | Peran |
| :--- | :--- | :--- |
| **Frontend (FE)** | **Vite + React.js (JavaScript)** | Single Page Application (SPA) cepat, responsif, dan ringan. |
| **Routing FE** | **React Router DOM v6** | Pengaturan rute halaman, layout bersarang (nested), dan proteksi login (auth guard). |
| **Styling FE** | **Tailwind CSS + Custom Glassmorphism** | UI modern dengan mode gelap/terang bawaan dan layout dashboard responsif. |
| **API Client** | **Axios dengan Interceptors** | Request ke backend otomatis membawa JWT token dan otomatis menangani token kadaluarsa (401). |
| **Backend (BE)** | **Node.js + Express.js** | API Server modular menggunakan arsitektur berbasis fitur (Feature-Based). |
| **Database & ORM** | **MySQL + Prisma ORM** | Schema-driven development, migrasi otomatis menggunakan database lokal biasa (XAMPP/Laragon), dan seeder data awal admin/role. |
| **Autentikasi** | **JWT (JSON Web Token)** | Akses aman dengan validasi token dan pembagian hak akses (RBAC). |
| **DevOps & Dev** | **PM2** | Proses manager untuk server production. |

---

## 📁 2. Struktur Folder Projek (`/struktur-apps`)

Kerangka dasar ini menggunakan struktur monorepo terpisah agar mudah dikelola dan dideploy secara fleksibel.

```text
e:/MyProject/git/struktur-apps/
├── /backend/                  # --- KODE BACKEND (API SERVER) ---
│   ├── prisma/
│   │   ├── schema.prisma      # Definisi tabel DB & relasinya
│   │   └── seed.js            # Seeder otomatis untuk default user & role
│   ├── /src/
│   │   ├── /config/           # Konfigurasi database, env, CORS, & limits
│   │   ├── /middlewares/      # Filter sebelum request masuk ke controller
│   │   │   ├── auth.js        # Validasi JWT token (verifyToken)
│   │   │   ├── role.js        # Pembatasan hak akses (authorizeRoles)
│   │   │   ├── validation.js  # Validasi body request (Joi/Zod)
│   │   │   └── errorHandler.js# Centralized error handler (anti-crash)
│   │   ├── /modules/          # PUSAT FITUR (Modular / Feature-Based)
│   │   │   ├── /auth/         # -- Fitur Autentikasi
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   └── auth.service.js
│   │   │   ├── /users/        # -- Fitur Kelola User
│   │   │   │   ├── user.controller.js
│   │   │   │   ├── user.routes.js
│   │   │   │   └── user.service.js
│   │   │   └── /utility/      # -- Fitur Umum (Opsional)
│   │   ├── /utils/            # Helper global
│   │   │   ├── response.js    # API Response Formatter (Success & Error)
│   │   │   └── storage.js     # Storage Wrapper (Local disk vs Cloud storage)
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Entrypoint server listener
│   ├── .env.example           # Contoh konfigurasi environment backend
│   ├── package.json
│   └── README.md
│
├── /frontend/                 # --- KODE FRONTEND (UI CLIENT) ---
│   ├── /src/
│   │   ├── /assets/           # Gambar, logo, & style custom
│   │   ├── /components/       # UI Reusable (Sleek Table, Form, Modal, Toast)
│   │   ├── /context/          # State global (AuthContext, ThemeContext)
│   │   ├── /hooks/            # Custom React Hooks
│   │   ├── /layouts/          # Layout penampung halaman (Dashboard, Auth)
│   │   ├── /pages/            # Halaman aplikasi (Dashboard, Login, Settings)
│   │   ├── /services/         # API Service (Axios Client & Interceptor)
│   │   ├── /routes/           # Konfigurasi React Router DOM v6
│   │   ├── App.jsx            # Parent component
│   │   └── main.jsx           # Entrypoint React
│   ├── tailwind.config.js     # Konfigurasi Tailwind CSS
│   ├── .env.example           # Contoh konfigurasi environment frontend
│   ├── package.json
│   └── README.md
│
└── README.md                  # Panduan instalasi cepat seluruh projek
