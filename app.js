const express = require('express');
const mongoose = require('mongoose');
const { celebrate } = require('celebrate');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const {
  signUpValidation,
  signInValidation,

} = require('./utils/validation');

app.post('/signup', celebrate(signUpValidation), createUser);
app.post('/signin', celebrate(signInValidation), login);

app.use(auth);
app.use(router);

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
