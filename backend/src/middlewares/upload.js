const multer = require('multer');

// Gunakan Memory Storage agar file dibuffer di RAM sebelum diproses oleh Storage Service
const storage = multer.memoryStorage();

// Filter opsional jika hanya ingin menerima file gambar
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak diizinkan! Hanya menerima file gambar (JPG/PNG/GIF).'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas maksimal file: 5MB
  },
});

module.exports = {
  upload,
  imageFilter,
};
