const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '643eaa90ca4a0139b4fd74d2',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
