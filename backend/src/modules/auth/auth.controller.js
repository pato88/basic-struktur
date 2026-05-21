const authService = require('./auth.service');
const { sendSuccess } = require('../../utils/response');
const { z } = require('zod');

// 1. Zod Schema untuk validasi input
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Username atau email wajib diisi.'),
  password: z.string().min(1, 'Password wajib diisi.'),
});

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter.')
    .max(30, 'Username maksimal 30 karakter.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh mengandung huruf, angka, dan underscore.'),
  email: z.string().email('Format email tidak valid.'),
  password: z.string().min(6, 'Password minimal terdiri dari 6 karakter.'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token wajib disertakan.'),
});

// 2. Controller Handlers
const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    const result = await authService.login(emailOrUsername, password);
    
    return sendSuccess(res, 'Login berhasil.', result);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register(username, email, password);
    
    return sendSuccess(res, 'Registrasi berhasil.', result, null, 21);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    
    return sendSuccess(res, 'Token berhasil diperbarui.', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginSchema,
  registerSchema,
  refreshSchema,
  login,
  register,
  refresh,
};
