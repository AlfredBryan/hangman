const express = require('express');
const bcrypt = require('bcrypt');
const Validator = require('validator');
const jwt = require('jsonwebtoken');
const helper = require('../middleware/helper');
require('dotenv').config();

const authenticate = require('../middleware/authentication');
const User = require('../models/user');
const Cart = require('../models/cart');
const CartItem = require('../models/cart_item');

const router = express.Router();

// fetch a single user
router.get(
  '/user',
  authenticate.checkTokenExists,
  authenticate.checkTokenValid,
  (req, res) => {
    const token = helper(req);
    User.findOne({ _id: token.id })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .send({ status: 'failed', message: 'user not found' });
        }

        Cart.findOne({ user_id: user._id, ordered: false }).then((cart) => {
          if (!cart) {
            return res.status(200).send({
              status: 'successful',
              message: 'found user',
              data: user,
              cart_items: [],
            });
          }

          CartItem.find({ cart_id: cart._id }).then((cart_item) => {
            return res.status(200).send({
              status: 'successful',
              message: 'found user',
              data: user,
              cart_items: cart_item,
            });
          });
          // return res.send(cart);
        });

        // return res
        //   .status(200)
        //   .send({ status: 'successful', message: 'found user', data: user });
      })
      .catch((error) => {
        throw error;
      });
  }
);

//fetch all users
router.get('/users', authenticate.checkAdmin, (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length < 1) {
        res.status(404).send({ status: 'failed', message: 'no user found' });
      } else {
        res
          .status(200)
          .send({ status: 'successful', message: 'users found', data: users });
      }
    })
    .catch((error) => {
      throw error;
    });
});

//Create a user
router.post('/create_user', (req, res) => {
  const { name, state, address, phone, email, is_admin, password } = req.body;

  if (!name) {
    return res.status(422).send({ message: 'Name is required' });
  }
  if (!address) {
    return res.status(422).send({ message: 'Address is required' });
  }

  if (!phone || phone.length < 11) {
    return res
      .status(422)
      .send({ message: 'Phone number must be at least 11 characters' });
  }

  if (!Number(phone)) {
    return res.status(422).send({ message: 'Phone number must be a number' });
  }

  if (!password || password.length < 6) {
    return res
      .status(422)
      .send({ message: 'Password must be at least 6 characters' });
  }

  if (!Validator.default.isEmail(email)) {
    return res.status(422).send({ message: 'Invalid email' });
  }

  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.status(422).send({ message: 'Email already in use' });
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    User.findOne({ phone }).then((user) => {
      if (user) {
        return res
          .status(422)
          .send({ status: 'failed', message: 'Phone number already in use' });
      } else {
        User.create({
          name,
          state,
          address,
          phone,
          is_admin,
          password: hashPassword,
          email,
        }).then((user) => {
          if (!user) {
            return res
              .status(500)
              .send({ status: 'failed', message: 'registration failed' });
          } else {
            const token = jwt.sign(
              {
                id: user._id,
                user_type: user.user_type,
                is_admin: user.is_admin,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: '3d',
              }
            );
            return res.status(201).send({
              status: 'successful',
              message: 'user created',
              data: user,
              token: token,
            });
          }
        });
      }
    });
  });
});

router.post('/user_login', (req, res) => {
  const errors = [];
  const { phone, password } = req.body;
  if (!Number.isInteger(phone)) {
    errors.push({ message: 'phone must be a number' });
    if (phone.length < 11) {
      errors.push({ message: 'phone number incorrect' });
    }
  }
  if (errors.length > 1) {
    res.status(422).send(errors);
  } else {
    User.findOne({ phone }, (err, user) => {
      if (err) return res.status(500).send({ message: 'login error' });
      if (!user) return res.status(404).send({ message: 'user not found' });

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid)
        return res.status(403).send({ message: 'login invalid' });
      const token = jwt.sign(
        { id: user._id, user_type: user.user_type, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        {
          expiresIn: '3d', // expires in 24 hours
        }
      );
      res.json({
        user: user,
        message: 'Authenticated',
        token: token,
      });
    });
  }
});

module.exports = router;
