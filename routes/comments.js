//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const commentsRouter = express.Router();
const { check, validationResult } = require('express-validator');

const { Comment, Story, User } = require('../db/models');

const { asyncHandler, csrfProtection, handleValidationErrors } = require('./utils');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../auth');

//-------------------------------------------------------------------VALIDATIONS------------------------------------------------------------------//

const commentValidations = [
  check("content")
    .exists({ checkFalsy: true })
    .withMessage("Comment can not be empty."),
];

//-------------------------------------------------------------------CREATE COMMENT------------------------------------------------------------------//

commentsRouter.post("/", asyncHandler(async (req, res, next) => {
  // console.log("start comments submit");
  // console.log(req.session);
  const userId = req.session.auth.userId;
  const sessionUser = await User.findByPk(userId);
  // console.log("SESSION USER", sessionUser)
  const username = sessionUser.username
  const { content, storyId } = req.body;
  const comment = await Comment.create({
    content,
    userId,
    storyId
  })
  res.json({ username, comment })
}))

//-------------------------------------------------------------------DELETE COMMENT------------------------------------------------------------------//


commentsRouter.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {

  const commentId = parseInt(req.params.id, 10);

  const comment = await Comment.findByPk(commentId);

  await comment.destroy()

  res.json("Comment Deleted.")
}))

//-------------------------------------------------------------------EDIT COMMENT------------------------------------------------------------------//

commentsRouter.patch('/:id(\\d+)', asyncHandler(async (req, res, next) => {

  const commentId = parseInt(req.params.id, 10);

  const comment = await Comment.findByPk(commentId);

  await comment.update()

  res.json("Comment Edited Successfully .")
}))

module.exports = commentsRouter
