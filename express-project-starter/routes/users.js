const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require('../db/models');

const { csrfProtection, asyncHandler } = require('./utils');

const userValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a username.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Your username must be between 2 and 50 characters.')
    .custom((value) => {
      return db.User.findOne({ where: { username: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('This username is unavailable.');
          }
        })
    }),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an email address.')
    .isLength({ max: 250 })
    .withMessage('Email address must not be more than 255 characters.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .custom((value) => {
      return db.User.findOne({ where: { email: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('This email address is already registered.');
          }
        })
    }),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value to confirm your password.')
    .isLength({ max: 50 })
    .withMessage('Confirm Password must not be more than 50 characters.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match the provided password.')
      };
      return true;
    })
]


/* GET users listing. */
router.get('/signup', csrfProtection, (req, res, next) => {
  const user = db.User.build();
  res.render('user-signup', {
    title: 'User Sign Up',
    user,
    csrfToken: req.csrfToken()
  });
});

router.post('/signup', csrfProtection, userValidators, asyncHandler(async (req, res, next) => {
  const {
    username,
    password,
    email
  } = req.body;

  const user = db.User.build({
    username,
    password,
    email
  });

  // Validation here
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(password, 12);
    user.hashedPassword = hashedPassword;
    await user.save();
    // Then log in user
    loginUser(req, res, user);
    return res.redirect('/');
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
  };
}));

module.exports = router;
