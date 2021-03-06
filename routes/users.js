//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { Story, User, Comment, Like, Follow } = db;
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
      return User.findOne({ where: { username: value } })
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
      return User.findOne({ where: { email: value } })
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
  const user = User.build();
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

  const user = User.build({
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
    const user = await User.findOne({ where: { email } });

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
    const user = await User.findOne({ where: { email } });

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
  // console.log("USER ID", userId)
  const user = await User.findByPk(userId, {
    include: [Story, Comment, {
      model: User,
      as: 'followers'
  }, {
    model: User,
    as: 'followings'
  }]
  });
  // console.log("RES LOCALS USER ID", res.locals.user.id)
  const userStories = user.Stories;

  let sessionUserId;
  let sessionUser;
  let sessionUsername;
  if (res.locals.user) {
    sessionUserId = res.locals.user.id;
    sessionUser = await User.findByPk(sessionUserId);
    sessionUsername = sessionUser.username;
  };
  res.render('user-profile', { title: `${user.username}'s Profile Page`, user, userStories, sessionUser, sessionUsername });
}))

router.get('/:userId/followers', asyncHandler(async (req, res, next) => {
  const userId = (req.params.userId);
  const user = await User.findByPk(userId, {
    include: [{
      model: User,
      as: 'followers'
  }]
  });

  // here retrieve the each follower's info
  let followerObj = {};

  for (let u of user.followers) {
    const id = u.Follow.followerId;
    const followerInfo = await User.findByPk(id, {
      include: [{
        model: User,
        as: 'followers'
    }]
    });
    followerObj[id] = followerInfo;
  };
  //console.log(???testing???, followerObj);
  let sessionUserId;
  let sessionUser;
  let sessionUsername;
  if (res.locals.user) {
    sessionUserId = res.locals.user.id;
    sessionUser = await User.findByPk(sessionUserId);
    sessionUsername = sessionUser.username;
  }
  res.render('follower', { title: `${user.username}'s Followers Page`, user, sessionUser, sessionUsername, followerObj});
}))


router.get('/:userId/followings', asyncHandler(async (req, res, next) => {
  const userId = (req.params.userId);
  const user = await User.findByPk(userId, {
    include: [{
      model: User,
      as: 'followings'
    },
    {
      model: User,
      as: 'followers'
    }]
  });

  // here retrieve the each follower's info
  let followingObj = {};

  for (let u of user.followings) {
    const id = u.Follow.creatorId;
    const followerInfo = await User.findByPk(id, {
      include: [{
        model: User,
        as: 'followers'
    }]
    });
    followingObj[id] = followerInfo;
  };
  //console.log(???testing???, followerObj);
  let sessionUserId;
  let sessionUser;
  let sessionUsername;
  if (res.locals.user) {
    sessionUserId = res.locals.user.id;
    sessionUser = await User.findByPk(sessionUserId);
    sessionUsername = sessionUser.username;
  }
  res.render('following', { title: `${user.username}'s Followings Page`, user, sessionUser, sessionUsername, followingObj});
}))

module.exports = router;
