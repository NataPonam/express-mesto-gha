const { Error } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BAD_REQUEST, ERROR_NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/utils');
const ConflictError = require('../errors/ConflictError');// 409
const Unauthorized = require('../errors/Unauthorized');// 401
const BadRequest = require('../errors/BadRequest');// 400

const createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new Unauthorized('Пользователь с таким email уже существует');
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hash });
    res.status(200).send({ messsage: `Пользователь ${newUser.email} успешно зарегистрирован` });
  } catch (error) {
    if (error.statusCode === 401) {
      res.status(error.statusCode).send({ message: error.message });
    } else {
      res.status(400).send({ message: 'Некорректный запрос серверу' });
    }
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })

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
    .then((user) => res.send(user))
    .catch(next);
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
