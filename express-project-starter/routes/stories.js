//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { Story } = db;
const { asyncHandler, csrfProtection } = require('./utils');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../auth');

//-------------------------------------------------------------------VALIDATIONS------------------------------------------------------------------//

const storyValidations = [
    check("title")
        .isLength({ max: 255 })
        .withMessage("Name must not be more than 255 characters long")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a title"),
    check("content")
        .exists({ checkFalsy: true })
        .withMessage("Content can not be empty."),
];

//--------------------------------------------------------------------CUSTOM ERRORS-------------------------------------------------------------------------------//

const storyNotFoundError = (storyId) => {
    const err = new Error("The requested story could not be found with the given ID.");
    err.title = 'Story not found.'
    err.status = 404;
    // next(err);
    return err
}

//-------------------------------------------------------------------FORM ROUTES/ GENERAL ROUTES------------------------------------------------------------------//

//~~~~CREATE NEW STORY~~~~//
router.get('/create', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
    const story = await Story.build();
    console.log(story);
    res.render('story-create', {
        csrfToken: req.csrfToken(),
        title: "Create a Story",
        story,
    })
}))

//~~~~GET SPECIFIC STORY~~~~//
router.get('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res, next) => {
    const storyId = parseInt(req.params.id, 10);
    const story = await Story.findByPk(storyId);
    if (story) {
        res.json({ story })
    } else {
        next(storyNotFoundError(storyId))
    }
}))

//-------------------------------------------------------------------FORM SUBMISSION ROUTES------------------------------------------------------------------//
//~~~~SUBMIT STORY~~~~//
router.post('/create', requireAuth, csrfProtection, storyValidations, asyncHandler(async (req, res, next) => {
    const { title, content } = req.body;
    const story = Story.build({
        userId: res.locals.user.id, title, content
    })
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        await story.save();
        res.redirect('/stories/${story.id}');
    } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('story-create', {
            title: 'Create a Story',
            story,
            errors,
            csrfToken: req.csrfToken(),
        });
    }
}));

//-------------------------------------------------------------------EDIT ROUTES------------------------------------------------------------------//

//-------------------------------------------------------------------DELETE ROUTES------------------------------------------------------------------//


module.exports = router;
