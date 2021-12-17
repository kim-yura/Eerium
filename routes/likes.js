//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const likesRouter = express.Router();
const { check, validationResult } = require('express-validator');

const { sequelize, Comment, Story, Like, User } = require('../db/models');

const { asyncHandler, csrfProtection, handleValidationErrors } = require('./utils');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../auth');

//-------------------------------------------------------------------CREATE LIKE------------------------------------------------------------------//

// likesRouter.post("/", asyncHandler(async (req, res, next) => {
    // const userId = req.session.auth.userId;
    // const sessionUser = await User.findByPk(userId);
    // const commentId = parseInt(req.params.id, 10);

    // const { userId, storyId, commentId } = req.body;


    // const comment = await Comment.findByPk(commentId);

    // const commentLike = await Like.create({
    //     userId,
    //     commentId
    //   })
    //   const storyLike = await Like.create({
    //       userId,
    //       storyId
    //     })

    //     res.json({})
    // }))


    //~~~~~LIKE STORY~~~~~//

    likesRouter.post("/create", asyncHandler(async (req, res) => {
        const userId = res.locals.user.id;
        const storyId = parseInt(req.params.id, 10);
        const like = await Like.findOne({
            where: { userId, storyId }
        })

        if (!like) {
            await like.create({
                userId,
                storyId
            })
        }
    }))

     //~~~~~LIKE COMMENT~~~~~//

    //  Grab all of the comment like buttons--Options for that would be something like doc query select all
    //  Iterate over all grabbed buttons while adding event listeners to each button
    //      grab comment id attached to the button
    //      put grabbed ID and put them into a body object

    //      add fetch to method (PUT) and add to this a path of stories/comments/likes, and send body object

    likesRouter.post("/create", asyncHandler(async (req, res) => {
        const userId = res.locals.user.id;
        const {storyId, commentId } = req.body;
        // const storyId = parseInt(req.params.id, 10);
        // const commentId = parseInt(req.params.id, 10);

        const like = await Like.findOne({
            where: { userId, storyId, commentId }
        })

        if (!like) {
            await like.create({
                userId,
                storyId,
                commentId
            })
        }
    }))

    //-------------------------------------------------------------------REMOVE LIKE------------------------------------------------------------------//

    likesRouter.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {

        const commentId = parseInt(req.params.id, 10);

        const comment = await Comment.findByPk(commentId);

        await comment.destroy()

        res.json("Comment Deleted.")
    }))




    likesRouter.post("/create", asyncHandler(async (req, res) => {
        const userId = res.locals.user.id;
        const storyId = parseInt(req.params.id, 10);
        const like = await Like.findOne({
            where: { userId, storyId }
        })

        if (!like) {
            await like.create({
                userId,
                storyId
            })
        }
    }))

    module.exports = likesRouter