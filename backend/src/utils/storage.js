const fs = require('fs');
const path = require('path');

/**
 * Helper untuk mengupload file (Lokal atau Cloudinary)
 * Mengharapkan objek file dari Multer (MemoryStorage)
 */
const uploadFile = async (file) => {
  if (!file) return null;

  const provider = process.env.STORAGE_PROVIDER || 'local';

  if (provider === 'cloudinary') {
    try {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'app_uploads' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    } catch (err) {
      throw new Error(
        'Cloudinary error. Pastikan package "cloudinary" sudah di-install dan file .env sudah dikonfigurasi dengan benar.'
      );
    }
  }

  // DEFAULT: LOCAL STORAGE (Menyimpan di PC Server Node.js)
  const uploadDir = path.join(__dirname, '../../public/uploads');

  // Pastikan folder folder upload sudah terbuat
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Membuat nama file unik untuk menghindari tabrakan nama file
  const fileExt = path.extname(file.originalname);
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const fileName = `${uniqueSuffix}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);

  // Menulis file buffer dari memory ke harddisk server
  fs.writeFileSync(filePath, file.buffer);

  // Mengembalikan URL lengkap file yang bisa diakses publik
  const appUrl = process.env.APP_URL || 'http://localhost:5000';
  return `${appUrl}/uploads/${fileName}`;
};

module.exports = {
  uploadFile,
};
