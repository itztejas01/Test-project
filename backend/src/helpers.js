// Hash password function
const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const successResponse = (res, message = "", data = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = "", data = {}, status = 400) => {
  return res.status(status).json({
    success: false,
    message,
    data,
  });
};
const PAGE_LIMIT = 10;
const paginate = (page, limit = PAGE_LIMIT) => {
  const offset = (page - 1) * limit;

  return { offset, limit };
};
module.exports = {
  hashPassword,
  successResponse,
  errorResponse,
  paginate,
  PAGE_LIMIT,
};
