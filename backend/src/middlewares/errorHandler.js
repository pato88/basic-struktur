const { sendError } = require('../utils/response');

/**
 * Middleware untuk menangkap semua error di aplikasi Express
 */
const errorHandler = (err, req, res, next) => {
  // Log error di console server untuk debugging
  console.error('=== ERROR DETECTED ===');
  console.error(err);
  console.error('======================');

  // 1. Tangani Error Validasi dari Zod
  if (err.name === 'ZodError' || (err.errors && err.name === 'ZodError')) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 'Validasi input gagal', formattedErrors, 400);
  }

  // 2. Tangani Error Database Prisma (misal unique constraint violation)
  if (err.code && err.code.startsWith('P')) {
    let message = 'Terjadi kesalahan pada database';
    let statusCode = 500;

    if (err.code === 'P2002') {
      message = `Data ${err.meta?.target || 'field'} sudah digunakan (duplikat)`;
      statusCode = 409; // Conflict
    } else if (err.code === 'P2025') {
      message = 'Data yang dicari tidak ditemukan';
      statusCode = 404;
    }

    return sendError(res, message, null, statusCode);
  }

  // 3. Tangani Custom JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Token tidak valid', null, 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token sudah kadaluarsa', null, 401);
  }

  // 4. Default Error Server (500)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';
  
  return sendError(res, message, null, statusCode);
};

module.exports = errorHandler;
