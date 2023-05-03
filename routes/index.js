const router = require('express').Router();
const { celebrate } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/NotFound');
const { createUser, login } = require('../controllers/users');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

const {
  signUpValidation,
  signInValidation,

} = require('../utils/validation');

router.post('/signup', celebrate(signUpValidation), createUser);
router.post('/signin', celebrate(signInValidation), login);

router.use((req, res, next) => {
  next(new NotFound('Такой страницы не сущестует'));
});
module.exports = router;
