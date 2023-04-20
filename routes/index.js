const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { ERROR_NOT_FOUND } = require('../utils/utils');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Такой страницы не сущестует' });
});
module.exports = router;
