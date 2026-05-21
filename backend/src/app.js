const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

// Import Rute Fitur
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');

const app = express();

// 1. Keamanan Header HTTP (Helmet)
// Menonaktifkan crossOriginResourcePolicy agar gambar static di backend bisa dimuat oleh domain frontend
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// 2. Pengaturan CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Di production, ganti dengan domain frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// 3. Rate Limiter (Membatasi brute-force, maks 200 request per 15 menit per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari komputer Anda. Silakan coba lagi dalam 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// 4. Parser Body Request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Folder Static untuk File Upload
// http://localhost:5000/uploads/nama-file.jpg
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 6. Mapping Rute API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root Endpoint untuk pengecekan status server
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Boilerplate API Server is running.',
    time: new Date(),
  });
});

// 7. Penanganan Endpoint Tidak Ditemukan (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint API ${req.originalUrl} (${req.method}) tidak ditemukan.`,
  });
});

// 8. Global Centralized Error Handler (Wajib di paling bawah)
app.use(errorHandler);

module.exports = app;
