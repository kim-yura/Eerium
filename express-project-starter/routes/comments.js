//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const db = require('../db/models');

const { Comment } = db;

const { asyncHandler, csrfProtection, handleValidationErrors } = require('./utils');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../auth');

//-------------------------------------------------------------------VALIDATIONS------------------------------------------------------------------//

const commentValidations = [
    check("content")
        .exists({ checkFalsy: true })
        .withMessage("Content can not be empty."),
];

const checkPermissions = (story, currentUser) => {
    if (story.userId !== currentUser.id) {
        const err = new Error('Illegal operation.');
        err.status = 403; // Forbidden
        throw err;
    }
};
//--------------------------------------------------------------------CUSTOM ERRORS-------------------------------------------------------------------------------//

const commentNotFoundError = (commentId) => {
    const err = new Error("The requested comment could not be found with the given ID.");
    err.title = 'Comment not found.'
    err.status = 404;
    // next(err);
    return err
}

//--------------------------------------------------------------------GET ROUTES-------------------------------------------------------------------------------//

//~~~~~GET ALL COMMENTS~~~~~//
router.get("/", asyncHandler(async (req, res) => {
      const comments = await Comment.findAll();
      res.json({ comments });
    })
  );

//~~~~~GET SPECIFIC COMMENT~~~~~//
  router.get("/:id(\\d+)", asyncHandler(async (req, res, next) => {
      const taskId = parseInt(req.params.id, 10);
      const task = await Task.findByPk(taskId);
      res.json({ task });
    })
  );

//--------------------------------------------------------------------POST ROUTES-------------------------------------------------------------------------------//

//~~~~~CREATE A COMMENT~~~~~//
  router.post("/", commentValidations, handleValidationErrors, asyncHandler(async (req, res) => {
      const { storyId, userId, content } = req.body;
      const comment = await Comment.create({ storyId, userId, content });
      res.status(201).json({ comment });
    })
  );



  module.exports = router;