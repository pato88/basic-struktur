const prisma = require('../../config/db');
const bcrypt = require('bcryptjs');

/**
 * Mendapatkan semua user dengan pagination & search
 */
const getAllUsers = async (page = 1, limit = 10, search = '') => {
  const skip = (page - 1) * limit;

  const where = {};
  if (search) {
    where.OR = [
      { username: { contains: search } },
      { email: { contains: search } },
    ];
  }

  // Menggunakan transaction agar query count & findMany berjalan bersamaan
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  // Bersihkan field password dari response
  const sanitizedUsers = users.map((u) => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });

  return {
    users: sanitizedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Mendapatkan satu user berdasarkan ID
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!user) {
    throw new Error('User tidak ditemukan.');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Membuat user baru (oleh Admin)
 */
const createUser = async (data) => {
  const { username, email, password, roleId } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error('Username atau Email sudah terdaftar.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      roleId: parseInt(roleId),
      isActive: true,
    },
    include: { role: true },
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Mengubah data user (oleh Admin)
 */
const updateUser = async (id, data) => {
  const { username, email, password, roleId, isActive } = data;

  // Cek validasi username/email ganda pada user lain
  if (username || email) {
    const conditions = [];
    if (username) conditions.push({ username });
    if (email) conditions.push({ email });

    const duplicate = await prisma.user.findFirst({
      where: {
        id: { not: id },
        OR: conditions,
      },
    });

    if (duplicate) {
      throw new Error('Username atau Email sudah digunakan oleh user lain.');
    }
  }

  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (roleId) updateData.roleId = parseInt(roleId);
  if (isActive !== undefined) updateData.isActive = isActive;
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    include: { role: true },
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

/**
 * Menghapus user
 */
const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!user) {
    throw new Error('User tidak ditemukan.');
  }

  // Larang menghapus Superadmin utama
  if (user.role.name === 'SUPERADMIN') {
    throw new Error('User dengan role SUPERADMIN tidak dapat dihapus.');
  }

  await prisma.user.delete({
    where: { id },
  });

  return { id };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
