const { sendError } = require('../utils/response');

/**
 * Middleware untuk membatasi akses berdasarkan Nama Role (misal: SUPERADMIN, ADMIN)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Internal Server Error. Context user tidak ditemukan.', null, 500);
    }

    // SUPERADMIN otomatis lolos semua pengecekan role
    if (req.user.role === 'SUPERADMIN') {
      return next();
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return sendError(res, 'Akses ditolak. Role Anda tidak diizinkan mengakses halaman ini.', null, 403);
  };
};

/**
 * Middleware untuk membatasi akses berdasarkan Permissions khusus (misal: 'manage:users')
 */
const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Internal Server Error. Context user tidak ditemukan.', null, 500);
    }

    const { permissions } = req.user;

    // Jika memiliki permission 'all' (seperti SUPERADMIN), izinkan semua request
    if (permissions.includes('all')) {
      return next();
    }

    // Periksa apakah user memiliki semua permission yang dibutuhkan
    const hasPermission = requiredPermissions.every((perm) => permissions.includes(perm));

    if (hasPermission) {
      return next();
    }

    return sendError(res, 'Akses ditolak. Anda tidak memiliki izin (permission) yang diperlukan.', null, 403);
  };
};

module.exports = {
  authorizeRoles,
  authorizePermissions,
};
