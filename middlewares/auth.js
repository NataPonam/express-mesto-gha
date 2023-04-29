const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

/* module.exports = (req, res, next) => {
  const { autorization } = req.headers;

  if (!autorization || !autorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходимо зарегистрироваться'));
    // return res.status(401).send({ message: 'Необходимо зарегистрироваться' });
  }

  const token = autorization.replace('Bearer ', '');
  // верификация токена
  let payload;
  try {
    payload = jwt.verify(token);
  } catch (err) {
    // return res.status(401).send({ message: 'Необходимо авторизоваться' });
    return next(new Unauthorized('Необходимо авторизоваться'));
  }
  req.user = payload;
  return next();
}; */

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима регистрация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'что-то очень секретное');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
