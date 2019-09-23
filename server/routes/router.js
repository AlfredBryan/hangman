const router = require("express").Router();
const validator = require("../middleware/validator");
const authenticate = require("../middleware/authentication");
const userController = require("../controllers/user");

//Registration
router
  .route("/register")
  .post(
    validator.checkBodyContains("username", "gender", "password"),
    validator.checkBodyNotEmpty("username", "gender", "password"),
    validator.checkBodyMinValue(3, "username"),
    validator.checkBodyMinValue(6, "password"),
    validator.checkBodyMaxValue(70, "username", "password"),
    validator.checkUserNameExists,
    userController.register
  );
// Login

router
  .route("/login")
  .post(
    validator.checkBodyContains("username", "password"),
    validator.checkBodyNotEmpty("email", "password"),
    userController.login
  );

module.exports = router;
