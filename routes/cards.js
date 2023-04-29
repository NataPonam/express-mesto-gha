const cardRouter = require('express').Router();
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

cardRouter.get('/', auth, getAllCards);
cardRouter.post('/', auth, createCard);
cardRouter.delete('/:cardId', auth, deleteCard);
cardRouter.put('/:cardId/likes', auth, likeCard);
cardRouter.delete('/:cardId/likes', auth, dislikeCard);

module.exports = cardRouter;
