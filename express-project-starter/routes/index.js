const express = require('express');
const router = express.Router();
const db = require('../db/models')
const { csrfProtection, asyncHandler } = require('./utils');


const findAuthorName = async(userId) => {
  const author = await db.User.findByPk(userId);
  console.log(author.dataValues.username);
  return author.dataValues.username;
};

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  const stories = await db.Story.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  });

  const authorsArr = [];

  stories.forEach (async (story) => {
    const author = await db.User.findByPk(story.dataValues.userId);
    const username = author.dataValues.username;
    console.log('Username is', username);
    story.dataValues.authorUsername = username;
    authorsArr.push(username);
    console.log(story.dataValues.authorUsername);
    console.log(authorsArr);
  });





  res.render('index', { title: 'Welcome to Eerium', stories, authorsArr });
}));

module.exports = router;
