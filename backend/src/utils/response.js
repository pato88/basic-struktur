/**
 * Helper untuk mengirim response sukses yang seragam
 */
const sendSuccess = (res, message, data = null, pagination = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (pagination !== null) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

/**
 * Helper untuk mengirim response error yang seragam
 */
const sendError = (res, message, errors = null, statusCode = 400) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
