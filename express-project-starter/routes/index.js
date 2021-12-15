//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
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

  res.render('index', { title: 'Welcome to Eerium', stories });
}));

module.exports = router;
