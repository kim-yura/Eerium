//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../db/models')
const { csrfProtection, asyncHandler } = require('./utils');

//-------------------------------------------------------------------HOME------------------------------------------------------------------//

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  const stories = await db.Story.findAll({
    include: db.User,
    order: [
      ['createdAt', 'DESC']
    ]
  });
  let sessionUserId;
  let sessionUser;
  let sessionUsername;
  if (res.locals.user) {
    sessionUserId = res.locals.user.id;
    sessionUser = await db.User.findByPk(sessionUserId);
    sessionUsername = sessionUser.username;
  };

  res.render('index', { title: 'Welcome to Eerium', stories, sessionUser, sessionUsername });
}));

module.exports = router;
