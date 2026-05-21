const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/auth');
const { authorizeRoles } = require('../../middlewares/role');
const validate = require('../../middlewares/validation');
const {
  createUserSchema,
  updateUserSchema,
  querySchema,
  getAll,
  getById,
  create,
  update,
  remove,
} = require('./user.controller');

// Semua route di file ini dilindungi oleh validasi JWT Token
router.use(verifyToken);

// Hanya SUPERADMIN dan ADMIN yang bisa mengelola user
router.get('/', authorizeRoles('SUPERADMIN', 'ADMIN'), validate(querySchema, 'query'), getAll);
router.post('/', authorizeRoles('SUPERADMIN', 'ADMIN'), validate(createUserSchema), create);
router.put('/:id', authorizeRoles('SUPERADMIN', 'ADMIN'), validate(updateUserSchema), update);
router.delete('/:id', authorizeRoles('SUPERADMIN', 'ADMIN'), remove);

// Detail user
router.get('/:id', authorizeRoles('SUPERADMIN', 'ADMIN'), getById);

module.exports = router;
