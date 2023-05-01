// const { Error } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BAD_REQUEST, ERROR_NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/utils');
const ConflictError = require('../errors/ConflictError');// 409
const Unauthorized = require('../errors/Unauthorized');// 401
const BadRequest = require('../errors/BadRequest');// 400
const NotFound = require('../errors/NotFound');// 404

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      res.status(200).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('409!!!Такой у нас уже есть'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('400 Что-то не то'));
      }  else {
        next(err);
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')

    .then((user) => {
      if (!user) {
        throw new BadRequest('Неверный email или пароль');
        // res.status(400).send({ message: 'неверный email или пароль' });
      }
      bcrypt.compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            throw new BadRequest('Неверный email или пароль');
            // res.status(400).send({ message: 'неверный email или пароль' });
          }
          const token = jwt.sign({ _id: user._id }, 'что-то очень секретное', { expiresIn: '7d' });
          res.status(200).send({ token });
          // res.status(200).send(user);
        });
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

const currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      throw new NotFound('Пользователь по _id не найден');
    })
    .catch((err) => { next(err); });
};

const getUsers = (req, res) => {
  User.find({ })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на стороне сервера' }));
};

const getUsersById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) { return res.send(user); }
      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на стороне сервера' });
    });
};

const updateUserProfile = (req, res) => {
  const id = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные при обновлении пользователя' });
      } return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на стороне сервера' });
    });
};

const updateUserAvatar = (req, res) => {
  const id = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные при обновлении аватара' });
      } return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось обновить аватар' });
    });
};
module.exports = {
  createUser, getUsers, getUsersById, updateUserProfile, updateUserAvatar, login, currentUser,
};
