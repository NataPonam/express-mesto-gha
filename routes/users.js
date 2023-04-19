const userRouter = require('express').Router();

const {
  getUsers, getUsersById, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.get('/:userId', getUsersById);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);
module.exports = userRouter;
