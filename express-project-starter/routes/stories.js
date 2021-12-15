//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const db = require('../db/models');

const { Story } = db;

const { asyncHandler, csrfProtection, handleValidationErrors } = require('./utils');
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

const checkPermissions = (book, currentUser) => {
    if (book.userId !== currentUser.id) {
        const err = new Error('Illegal operation.');
        err.status = 403; // Forbidden
        throw err;
    }
};

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
    // console.log(story.userId);
    if (story) {
        // res.json({ story })
        res.render('story-read', {
            csrfToken: req.csrfToken(),
            story,
        })
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
        res.redirect(`/stories/${story.id}`);
    } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('story-create', {
            story,
            errors,
            csrfToken: req.csrfToken(),
        });
    }
}));

//-------------------------------------------------------------------EDIT ROUTES------------------------------------------------------------------//

router.get('/:id(\\d+)/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const storyId = parseInt(req.params.id, 10);
    const story = await db.Story.findByPk(storyId);

    checkPermissions(story, res.locals.user);

    res.render('story-edit', {
        title: 'Edit Story',
        story,
        csrfToken: req.csrfToken(),
    });
}));

router.post('/:id(\\d+)/edit', requireAuth, csrfProtection, storyValidations, asyncHandler(async (req, res) => {
    const storyId = parseInt(req.params.id, 10);
    const storyToUpdate = await db.Story.findByPk(storyId);

    checkPermissions(storyToUpdate, res.locals.user);

    const {
        title,
        content
    } = req.body;

    const story = {
        title,
        content
    };

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await storyToUpdate.update(story);
        res.redirect(`/stories/${storyToUpdate.id}`);
    } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('story-edit', {
            title: 'Edit Story',
            story: { ...story, storyId },
            errors,
            csrfToken: req.csrfToken(),
        });
    }
}));


//-------------------------------------------------------------------DELETE ROUTES------------------------------------------------------------------//

//modified Tue Night, test done.
router.get('/:id(\\d+)/delete', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const storyId = parseInt(req.params.id, 10);
    const story = await db.Story.findByPk(storyId);
    checkPermissions(story, res.locals.user);

    res.render('story-delete', {
        csrfToken: req.csrfToken(),
        story
    });
}));

router.post('/:id(\\d+)/delete', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const storyId = parseInt(req.params.id, 10);
    const story = await db.Story.findByPk(storyId);

    console.log("my name is ", storyId);

    checkPermissions(story, res.locals.user);

    const userId = res.locals.user.id

    await story.destroy();
    // res.redirect('/');
    res.redirect(`/users/${userId}`);
}));

module.exports = router;
