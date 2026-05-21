/**
 * Middleware untuk memvalidasi data request menggunakan Zod Schema
 * @param {import('zod').ZodSchema} schema - Zod Schema yang ingin divalidasi
 * @param {'body' | 'query' | 'params'} target - Bagian request yang divalidasi (default: 'body')
 */
const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    try {
      // Validasi data dan replace data request dengan hasil parsing Zod (membersihkan field liar yang tidak didefinisikan)
      const validatedData = schema.parse(req[target]);
      req[target] = validatedData;
      next();
    } catch (error) {
      // Lempar error Zod ke Global Error Handler untuk diformat otomatis
      next(error);
    }
  };
};

module.exports = validate;
