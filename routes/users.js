const userRouter = require('express').Router();

const {
  getUsers, getUsersById, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUsersById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);
module.exports = userRouter;
