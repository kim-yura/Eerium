//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const commentsRouter = express.Router();
const { check, validationResult } = require('express-validator');

const { Comment, Story, User } = require('../db/models');

const { asyncHandler, csrfProtection, handleValidationErrors } = require('./utils');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../auth');
//const { Model } = require('sequelize/types');

//-------------------------------------------------------------------VALIDATIONS------------------------------------------------------------------//

const commentValidations = [
  check("content")
    .exists({ checkFalsy: true })
    .withMessage("Comment can not be empty."),
];


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


module.exports = commentsRouter

// //--------------------------------------------------------------------CUSTOM ERRORS-------------------------------------------------------------------------------//
// const checkPermissions = (story, currentUser) => {
//     if (story.userId !== currentUser.id) {
//         const err = new Error('Illegal operation.');
//         err.status = 403; // Forbidden
//         throw err;
//     }
// };

// const commentNotFoundError = (commentId) => {
//     const err = new Error("The requested comment could not be found with the given ID.");
//     err.title = 'Comment not found.'
//     err.status = 404;
//     // next(err);
//     return err
// }

// //--------------------------------------------------------------------GET ROUTES-------------------------------------------------------------------------------//

// //~~~~~GET ALL COMMENTS~~~~~//
// router.get("/", asyncHandler(async (req, res) => {
//       const comments = await Comment.findAll();
//       res.json({ comments });
//     })
//   );

// //~~~~~GET SPECIFIC COMMENT~~~~~//
//   router.get("/:id(\\d+)", asyncHandler(async (req, res, next) => {
//       const taskId = parseInt(req.params.id, 10);
//       const task = await Task.findByPk(taskId);
//       res.json({ task });
//     })
//   );

// //--------------------------------------------------------------------POST ROUTES-------------------------------------------------------------------------------//

// //~~~~~CREATE A COMMENT~~~~~//
//   router.post("/", commentValidations, handleValidationErrors, asyncHandler(async (req, res) => {
//       const { storyId, userId, content } = req.body;
//       const comment = await Comment.create({ storyId, userId, content });
//       res.status(201).json({ comment });
//     })
//   );
