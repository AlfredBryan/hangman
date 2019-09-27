const router = require("express").Router();
const validator = require("../middleware/validator");
const authenticate = require("../middleware/authentication");
const userController = require("../controllers/user");
const gameController = require("../controllers/game");

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

//User Profile
router
  .route("/profile")
  .get(
    authenticate.checkTokenExists,
    authenticate.checTokenValid,
    userController.getProfile
  );

//Available games
router
  .route("/games")
  .get(
    authenticate.checkTokenExists,
    authenticate.checTokenValid,
    gameController.getGames
  );

//Create Game
router
  .route("/game")
  .post(
    authenticate.checkTokenExists,
    authenticate.checTokenValid,
    gameController.createGame
  );

//Join Game
router
  .route("/join/:gameId")
  .get(
    authenticate.checkTokenExists,
    authenticate.checTokenValid,
    gameController.joinGame
  );

//Games assigned to User
router
  .route("/assigned")
  .get(
    authenticate.checkTokenExists,
    authenticate.checTokenValid,
    gameController.getGamesAssigned
  );

// Single game assigned to user
router
  .route("/assigned/:gameId")
  .get(
    authenticate.checkTokenExists,
    authenticate.checTokenValid,
    gameController.getSingleGamesAssigned
  );

//Play Single game assigned to User
router
  .route("/play/:gameId")
  .post(
    authenticate.checkTokenExists,
    authenticate.checTokenValid,
    validator.checkBodyContains("answer"),
    validator.checkBodyNotEmpty("answer"),
    gameController.playGameAssigned
  );

module.exports = router;
