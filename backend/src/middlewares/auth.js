const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');
const prisma = require('../config/db');

/**
 * Middleware untuk memverifikasi token JWT
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    // Periksa apakah token ada di header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Akses ditolak. Token tidak disediakan.', null, 401);
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi Token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dapatkan data user dari database beserta rolenya untuk mematikan token jika user di-delete/di-nonaktifkan
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!user) {
      return sendError(res, 'User pemilik token tidak ditemukan', null, 404);
    }

    if (!user.isActive) {
      return sendError(res, 'Akun Anda dinonaktifkan. Hubungi admin.', null, 403);
    }

    // parsing permission JSON string ke array
    let permissions = [];
    try {
      permissions = JSON.parse(user.role.permissions);
    } catch (e) {
      permissions = [];
    }

    // Simpan info user di req.user agar bisa diakses di controller selanjutnya
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      role: user.role.name,
      permissions: permissions,
    };

    next();
  } catch (error) {
    // Teruskan error ke Global Error Handler (misal JWT expired)
    next(error);
  }
};

module.exports = verifyToken;
