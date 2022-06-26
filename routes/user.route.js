const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const userService = require('../services/user.service');

//Users signup
//localhost:4000/user/signup
router.post('/signup', userController.RegisterUser);
//router.post('/signupStaff',userController.RegisterStaff);

//User login
//localhost:4000/user/login
router.post('/login', userController.userLogin);

//localhost:4000/user/getUser/:id
router.get('/getUser/:id', userService.findOneUser);

//Update user details
//localhost:4000/user/forgot-password
router.post('/forgot-password', userController.forgotPassword);
router.post('/forgot-password/:userId/:token', userController.resetPassword);
router.get(
  '/forgot-password/:userId/:token',
  userController.resetPasswordValid
);

router.post('/reset-password', userController.resetPassword);

module.exports = router;
