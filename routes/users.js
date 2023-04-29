const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUsersById, updateUserProfile, updateUserAvatar, currentUser,
} = require('../controllers/users');

userRouter.get('/', auth, getUsers);
userRouter.get('/:userId', getUsersById);
userRouter.get('/me', currentUser);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);
module.exports = userRouter;
