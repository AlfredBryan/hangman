const helper = require("../middleware/helper");
const Users = require("../models/user");
const Games = require("../models/game");

class game {
  /**
   * get all available game
   * @param {object} req - api request
   * @param {object} res - api response
   * @param {function} next - next middleware function
   * @return {json}
   */

  static async getGames(req, res, next) {
    //Get all pending games
    const games = await Games.find({
      status: "pending"
    }).populate("user", "username");

    if (games.length < 1) {
      res.status(200).send({
        success: true,
        message: "No Games Available"
      });
    }

    return res.status(200).json({
      message: "games available",
      games,
      statusCode: 200
    });
  }

  /**
   * create game
   * @param {object} req - api request
   * @param {object} res - api response
   * @param {function} next - next middleware function
   * @return {json}
   */
  static async createGame(req, res, next) {
    const { description, question } = req.body;
    const token = helper(req);
    const createGame = new Games({
      user: token.id,
      description,
      question
    });

    const result = await createGame.save();

    if (!result) {
      const err = new Error();
      err.message = "Error occured";
      err.statusCode = 500;
      return next(err);
    }

    return res.status(201).json({
      mesage: "game created",
      statusCode: 201
    });
  }

  /**
   * join pending game
   * @param {object} req - api request
   * @param {object} res - api response
   * @param {function} next - next middleware function
   * @return {json}
   */
  static async joinGame(req, res, next) {
    const token = helper(req);
    const { gameId } = req.params;

    const findGame = await Games.findOne({
      _id: gameId,
      status: "pending"
    });

    if (!findGame) {
      const err = new Error();
      err.message = "Sorry this game is no longer available";
      err.statusCode = 400;
      return next(err);
    }

    //Check if game creator is attempting to solve game
    if (findGame.user == token.id) {
      const err = new Error();
      err.message = "sorry cannot solve the game you created";
      err.statusCode = 400;
      return next(err);
    }

    // update game status and assign game to user
    const update = await Games.findByIdAndUpdate(
      { _id: gameId },
      {
        status: "inProgress",
        player: token.id
      }
    );
    if (!update) {
      const err = new Error();
      err.message = "error game couldn't be assigned";
      err.statusCode = 400;
      return next(err);
    }

    return res.status(200).json({
      mesage: "game successfully assigned to you",
      statusCode: 200
    });
  }
  /**
   * get all games assigned to user
   * @param {object} req - api request
   * @param {object} res - api response
   * @param {function} next - next middleware function
   * @return {json}
   */

  static async getGamesAssigned(req, res, next) {
    const token = helper(req);

    const games = await Games.find({
      status: "inProgress",
      player: token.id
    })
      .populate("user", "username")
      .populate("player", "username");

    if (games.length < 1) {
      const err = new Error();
      err.message = " No available game at the moment";
      err.statusCode = 200;
      return next(err);
    }

    return res.status(200).json({
      message: "games available",
      games,
      statusCode: 200
    });
  }

  /**
   * get single game assigned to user
   * @param {object} req - api request
   * @param {object} res - api response
   * @param {function} next - next middleware function
   * @return {json}
   */
  static async getSingleGamesAssigned(req, res, next) {
    const token = helper(req);
    const { gameId } = req.params;

    //get all games that are assigned to a user
    const games = await Games.findOne({
      status: "inProgress",
      player: token.id,
      _id: gameId
    })
      .populate("user", "username")
      .populate("player", "username");

    if (!games) {
      const err = new Error();
      err.message = "game does not exist";
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({
      message: "game available",
      games,
      statusCode: 200
    });
  }

  /**
   * play game
   * @param {object} req - api request
   * @param {object} res - api response
   * @param {function} next - next middleware function
   * @return {json}
   */
  static async playGameAssigned(req, res, next) {
    const token = helper(req);
    const { answer } = req.body;
    const { gameId } = req.params;

    //get all games assigned to a user
    const games = await Games.findOne({
      status: "inProgress",
      player: token.id,
      _id: gameId
    });

    if (!games) {
      const err = new Error();
      err.message = "sorry! this game wasn't assigned to you";
      err.statusCode = 200;
      return next(err);
    }

    if (games.game_life > 0 && games.question === answer) {
      const user = Users.findOne({
        _id: token.id
      });

      user.total_score + games.game_score;
      games.status = "Won";

      await games.save();

      await Users.findByIdAndUpdate(
        {
          _id: token.id
        },
        { total_score: games.game_score }
      );
      return res.status(200).json({
        message: "You won...",
        statusCode: 200
      });
    }

    if (games.game_life > 0 && games.question !== answer) {
      games.game_life--;
      const result = await games.save();

      return res.status(200).json({
        message: "wrong answer",
        life: result.game_life,
        statusCode: 200
      });
    }

    games.game_life = 20;
    games.status = "pending";
    games.player = undefined;
    await games.save();

    return res.status(200).json({
      message: "You Lost...",
      statusCode: 200
    });
  }
}

module.exports = game;
