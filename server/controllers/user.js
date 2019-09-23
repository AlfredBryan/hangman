const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

class user {
  /**
   * create user account
   * @param {object} req - api request
   * @param {object} res - api response
   * @param {function} next - next middleware function
   * @return {json}
   */
  static async register(req, res, next) {
    const { username, gender } = req.body;
    let { password } = req.body;
    password = bcrypt.hashSync(password, 10);

    const data = new Users({
      username,
      gender,
      password
    });

    const result = await data.save();

    if (!result) {
      const err = new Error();
      err.message = "error occured";
      err.statusCode = 500;
      return next(err);
    }

    return res.status(201).json({
      message: "user account created successfully",
      statusCode: 201
    });
  }

  /**
   * Log user in
   * @param {object} req - api request
   * @param {object} res - api response
   * @param {function} next - next middleware function
   * @return {json}
   */
  static async login(req, res, next) {
    const { username, password } = req.body;
    const result = await Users.findOne({
      username
    });
    if (!result) {
      const err = new Error();
      err.message = "username not found";
      err.statusCode = 404;
      return next(err);
    }

    const compare = bcrypt.compareSync(password, result.password);

    if (!compare) {
      const err = new Error();
      err.message = "incorrect password";
      err.statusCode = 401;
      return next(err);
    }

    // sign user token
    const token = jwt.sign(
      {
        id: result._id
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // unset user password
    result.password = undefined;

    return res.status(200).json({
      message: "logged in",
      statusCode: 200,
      token,
      result
    });
  }
}

module.exports = user;
