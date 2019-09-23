const jwt = require("jsonwebtoken");

const decodeToken = req => {
  const { token } = req.headers;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    const err = new Error();
    err.message = "not authorized";
    err.statusCode = 401;
    throw err;
  }

  return decoded;
};

module.exports = decodeToken;
