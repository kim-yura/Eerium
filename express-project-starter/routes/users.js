//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator');
const { loginUser, logoutUser, restoreUser } = require('../auth');


//-------------------------------------------------------------------VALIDATIONS------------------------------------------------------------------//

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

//-------------------------------------------------------------------USER SIGNUP------------------------------------------------------------------//

/* GET users listing. */
router.get('/signup', csrfProtection, (req, res) => {
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
    res.render('user-signup', {
      title: 'User Sign Up',
      user,
      errors,
      csrfToken: req.csrfToken()
    });
  };
}));

//-------------------------------------------------------------------LOGIN------------------------------------------------------------------//

// login
router.get('/login', csrfProtection, (req, res) => {
  res.render('user-login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
});

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

router.post('/login', csrfProtection, loginValidators, asyncHandler(async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const user = await db.User.findOne({ where: { email } });

    if (user !== null) {
      // console.log(user);
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

      if (passwordMatch) {
        loginUser(req, res, user);

        //  res.redirect('/');
        return res.redirect('/');
      }
    }
    errors.push('Login failed for the provided email address and password');
  } else {
    errors = validatorErrors.array().map((error) => error.msg);
  }

  res.render('user-login', {
    title: 'Login',
    email,
    errors,
    csrfToken: req.csrfToken(),
  });
}));

// router.use((req, res, next) => {
//   console.log("USERS ROUTER");
//   next();
// });

//-------------------------------------------------------------------LOGOUT------------------------------------------------------------------//

router.get('/logout', (req, res) => {
  // res.json("TEST");
  logoutUser(req, res);
  res.redirect('/');
});

//-------------------------------------------------------------------DEMO USER------------------------------------------------------------------//

router.get('/demo', asyncHandler(async (req, res) => {
  console.log("SUCCESSFUL LOGIN");
  const email = 'dave@dave.com';
  const password = 'Password@123';
  req.body = {
    email,
    password
  };

  let errors = [];
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const user = await db.User.findOne({ where: { email } });

    if (user !== null) {
      // console.log(user);
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

      if (passwordMatch) {
        loginUser(req, res, user);

        //  res.redirect('/');
        return res.redirect('/');
      }
    }
    errors.push('Login failed for the provided email address and password');
  } else {
    errors = validatorErrors.array().map((error) => error.msg);
  };
}));

//-------------------------------------------------------------------USER PROFILE ROUTE------------------------------------------------------------------//

//  User Page shows user's activity
router.get('/:userId', asyncHandler(async (req, res, next) => {
  const userId = (req.params.userId);
  const user = await db.User.findByPk(userId, {
    include: [db.Story, db.Comment]
  });
  const userStories = user.Stories;
  res.render('user-profile', { title: `${user.username}'s Profile Page`, user, userStories });
}))

console.log("Please delete me.")

module.exports = router;
