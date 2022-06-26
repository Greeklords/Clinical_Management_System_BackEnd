const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

module.exports = {
  signupUser: async (data) => {
    const salt = genSaltSync(10); //hashing password to save the user
    const dob = data.dob.slice(0, 10);
    data.dob = dob;
    data.password = hashSync(data.password, salt);
    const user = new User(data);
    const isExist = await User.findOne({ email: data.email });
    if (isExist) {
      return { success: false, message: 'User is already exist' };
    }
    const result = await user.save();

    return { success: true, result: result };
  },

  loginUser: async (data) => {
    const user = await User.findOne({ email: data.email });
    if (user) {
      const result = compareSync(data.password, user.password);
      if (result) {
        const jsontoken = sign({ result: user }, 'secret', {
          expiresIn: '1day',
        });
        const loggedUser = {
          token: jsontoken,
          user,
        };
        return { success: true, user: loggedUser };
      } else {
        return { success: false, message: 'Invalid Password' };
      }
    } else {
      return { success: false, message: 'Invalid email' };
    }
  },

  findOneUser : async (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User's profile not found with id " + req.params.id
                });
            }
            res.send(user);
        }).catch(err => {
            if (err) {
                return res.status(404).send({
                    message: "User's profile not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving user's profile with id " + req.params.id
            });
    });
  },    

  forgotPassword: async (data) => {
    const user = await User.findOne({ email: data.email });
    if (user) {
      //Generate a Token
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex'),
        }).save();
      }

      const link = `${process.env.BASE_URL}/reset-password/${user._id}/${token.token}`;
      const result = await sendEmail(user.email, 'Password reset', link);
      return result;
    } else {
      return { success: false, message: 'Invalid email' };
    }
  },

  resetPassword: async (data) => {
    const user = await User.findById(data.userId);
    if (!user) return { success: false, message: 'invalid link or expired' };

    const token = await Token.findOne({
      userId: user._id,
      token: data.token,
    });
    if (!token) return { success: false, message: 'invalid link or expired' };

    const salt = genSaltSync(10);
    data.password = hashSync(data.password, salt);

    user.password = data.password;

    await user.save();
    await token.delete();
    return { success: true, message: 'Password reset has been successful' };
  },

  resetPasswordValid: async (data) => {
    if (data.userId.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await User.findById(data.userId);
      if (user) {
        const token = await Token.findOne({
          userId: user._id,
          token: data.token,
        });
        if (token) {
          return { success: true, message: 'Valid Reset Link' };
        } else {
          return { success: false, message: 'invalid link or expired' };
        }
      } else {
        return { success: false, message: 'invalid link or expired' };
      }
    } else {
      return { success: false, message: 'invalid link or expired' };
    }
  },
};
