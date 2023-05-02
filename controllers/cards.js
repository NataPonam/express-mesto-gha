const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');// 400
const Forbidden = require('../errors/Forbidden');// 403
const NotFound = require('../errors/NotFound');// 404

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((allCards) => res.send(allCards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const id = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete({ _id: cardId })
    .then((card) => {
      if (!card) {
        return next(new NotFound('Не удалось удалить карточку, не найден id'));
      } if (!card.owner.equals(req.user._id)) {
        return next(new Forbidden('Невозможно удалить чужую карточку'));
      }
      return res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректные данные при удалении карточки'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        return next(new NotFound('Не удалось поставить лайк, не найден id'));
      }
      return res.send(card);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректные данные'));
        // return res.status(BAD_REQUEST).send({          message: 'Некорректные данные',        });
      } return next(err);
      // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось поставить лайк' });
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Не удалось удалить лайк, не найден id'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректные данные'));
      } return next(err);
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
