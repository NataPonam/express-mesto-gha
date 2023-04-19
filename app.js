const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const { ERROR_NOT_FOUND } = require('./utils/utils');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '643eaa90ca4a0139b4fd74d2',
  };
  next();
});

app.use(router);
app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Такой страницы не сущестует' });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
