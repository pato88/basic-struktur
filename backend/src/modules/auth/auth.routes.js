const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validation');
const {
  loginSchema,
  registerSchema,
  refreshSchema,
  login,
  register,
  refresh,
} = require('./auth.controller');

// Endpoint Login (validasi input -> jalankan controller)
router.post('/login', validate(loginSchema), login);

// Endpoint Register (validasi input -> jalankan controller)
router.post('/register', validate(registerSchema), register);

// Endpoint Refresh Token (validasi input -> jalankan controller)
router.post('/refresh', validate(refreshSchema), refresh);

module.exports = router;
