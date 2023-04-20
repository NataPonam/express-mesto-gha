const { Error } = require('mongoose');

const User = require('../models/user');
const { BAD_REQUEST, ERROR_NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/utils');

//Попыталась применить instanceof Error, подскажите вы это имели ввиду, все верно получилось?
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err instanceof Error) {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные при создании пользователя' });
      } return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Данные о пользователе не сохранились' });
    });
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
  createUser, getUsers, getUsersById, updateUserProfile, updateUserAvatar,
};
