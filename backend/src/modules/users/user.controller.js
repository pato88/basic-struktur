const userService = require('./user.service');
const { sendSuccess } = require('../../utils/response');
const { z } = require('zod');

// 1. Zod Validation Schemas
const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username minimal terdiri dari 3 karakter.')
    .max(30, 'Username maksimal 30 karakter.'),
  email: z.string().email('Format email tidak valid.'),
  password: z.string().min(6, 'Password minimal terdiri dari 6 karakter.'),
  roleId: z.number({ required_error: 'Role ID wajib dipilih.' }),
});

const updateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roleId: z.number().optional(),
  isActive: z.boolean().optional(),
});

// Skema untuk memvalidasi query parameter pada list user (?page=1&limit=10&search=john)
const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional().default(''),
});

// 2. Controller Handlers
const getAll = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query; // req.query sudah ditransform ke tipe data yang benar oleh middleware
    const result = await userService.getAllUsers(page, limit, search);
    
    return sendSuccess(res, 'Daftar user berhasil diambil.', result.users, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    return sendSuccess(res, 'Detail user berhasil diambil.', user);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    
    return sendSuccess(res, 'User berhasil dibuat.', user, null, 201);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    
    return sendSuccess(res, 'User berhasil diperbarui.', user);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    
    return sendSuccess(res, 'User berhasil dihapus.', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUserSchema,
  updateUserSchema,
  querySchema,
  getAll,
  getById,
  create,
  update,
  remove,
};
