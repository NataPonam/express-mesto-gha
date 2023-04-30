const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUsersById, updateUserProfile, updateUserAvatar, currentUser,
} = require('../controllers/users');

userRouter.get('/', auth, getUsers);
userRouter.get('/me', auth, currentUser);
userRouter.get('/:userId', getUsersById);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);
module.exports = userRouter;
