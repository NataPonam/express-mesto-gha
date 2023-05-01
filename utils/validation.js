const { Joi } = require('celebrate');

const regExp = /(https|http):\/\/(www\.)?([a-zA-Z0-9]{1}[a-zA-Z0-9\-]*\.?)\.{1}[a-zA-Z0-9]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

const signUpValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExp),
  }),
};

const signInValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

const getUserByIdValidation = {
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
};

const updateUserProfileValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
};

const createCardValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(regExp).required(),
  }),
};

const updateUserAvatarValidation = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regExp).required(),
  }),
};

const deleteCardValidation = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

const likeCardValidation = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

module.exports = {
  regExp,
  signUpValidation,
  signInValidation,
  getUserByIdValidation,
  updateUserProfileValidation,
  updateUserAvatarValidation,
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
};
