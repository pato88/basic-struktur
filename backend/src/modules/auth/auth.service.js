const prisma = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Helper untuk mengenerate JWT Access Token dan Refresh Token
 */
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role.name,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return { accessToken, refreshToken };
};

/**
 * Logika Bisnis Login Pengguna
 */
const login = async (emailOrUsername, password) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    },
    include: { role: true },
  });

  if (!user) {
    throw new Error('Username/Email tidak ditemukan atau password salah.');
  }

  if (!user.isActive) {
    throw new Error('Akun Anda dinonaktifkan. Silakan hubungi admin.');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Username/Email tidak ditemukan atau password salah.');
  }

  const tokens = generateTokens(user);

  let permissions = [];
  try {
    permissions = JSON.parse(user.role.permissions);
  } catch (e) {
    permissions = [];
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      permissions: permissions,
    },
    ...tokens,
  };
};

/**
 * Logika Bisnis Register Pengguna (Default: Role USER)
 */
const register = async (username, email, password) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error('Username atau Email sudah terdaftar.');
  }

  // Cari ID role USER untuk registrasi default
  const defaultRole = await prisma.role.findUnique({
    where: { name: 'USER' },
  });

  if (!defaultRole) {
    throw new Error('Role dasar USER belum dikonfigurasi di database. Hubungi admin.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      roleId: defaultRole.id,
      isActive: true,
    },
    include: { role: true },
  });

  const tokens = generateTokens(newUser);

  let permissions = [];
  try {
    permissions = JSON.parse(newUser.role.permissions);
  } catch (e) {
    permissions = [];
  }

  return {
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role.name,
      permissions: permissions,
    },
    ...tokens,
  };
};

/**
 * Logika Bisnis Refresh Token JWT
 */
const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token wajib disertakan.');
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: { role: true },
  });

  if (!user) {
    throw new Error('User pemilik token tidak ditemukan.');
  }

  if (!user.isActive) {
    throw new Error('Akun Anda dinonaktifkan.');
  }

  const tokens = generateTokens(user);

  let permissions = [];
  try {
    permissions = JSON.parse(user.role.permissions);
  } catch (e) {
    permissions = [];
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      permissions: permissions,
    },
    ...tokens,
  };
};

module.exports = {
  login,
  register,
  refresh,
};
