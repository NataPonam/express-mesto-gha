const Card = require('../models/card');
const { BAD_REQUEST, ERROR_NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/utils');

const getAllCards = (req, res) => {
  Card.find({})
    .then((allCards) => res.send(allCards))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на стороне сервера' }));
};
const createCard = (req, res) => {
  const id = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные при создании карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Карточка не сохранилась' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete({ _id: cardId })
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Не удалось удалить карточку, не найден id' });
      }
      return res.send(card);
    })
    .catch((err) =>  res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка при удалении карточки' }));

};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось поставить лайк' }));
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось удалить лайк' }));
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
