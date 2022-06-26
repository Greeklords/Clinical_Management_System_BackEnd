const Joi = require('joi');
const User = require('../models/user.model');
const {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
  resetPasswordValid,
} = require('../services/user.service');
const { genSaltSync, hashSync } = require('bcrypt');

module.exports = {
  RegisterUser: async (req, res) => {
    const schema = Joi.object({
      role: Joi.string().required(),
      firstName: Joi.string().min(5).max(50).required(),
      lastName: Joi.string().min(5).max(50).required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.number().required(),
      dob: Joi.date().raw().required(),
      password: Joi.string().min(5).required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    });

    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(400).send({ message: validation.error.message });
      return;
    }
    const data = validation.value;
    const result = await signupUser(data);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Register Success',
        result: result.result,
      });
    } else {
      return res.status(400).send({ message: result.message });
    }
  },

  userLogin: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(400).send({ message: validation.error.message });
      return;
    }
    const body = validation.value;

    const result = await loginUser(req.body);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'login Success',
        user: result.user,
      });
    } else {
      return res.status(400).send({ message: result.message });
    }
  },  

  forgotPassword: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });
    const validation = schema.validate(req.body);
    const data = validation.value;

    const result = await forgotPassword(data);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message:
          'Password Reset link has been successfully sent to your email!',
        response: result.response,
      });
    } else {
      return res.status(400).send({ message: result.message });
    }
  },

  resetPassword: async (req, res) => {
    const schema = Joi.object({ password: Joi.string().min(5).required() });

    const validation = schema.validate(req.body);
    const data = validation.value;

    console.log(data);
    const result = await resetPassword({
      userId: data.userId,
      password: data.password,
      token: data.token,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(400).send({ message: result.message });
    }
  },

  resetPasswordValid: async (req, res) => {
    const result = await resetPasswordValid({
      userId: req.params.userId,
      token: req.params.token,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(400).send({ message: result.message });
    }
  },
};
