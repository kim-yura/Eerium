const express = require('express');
const router = express.Router();

const db = require('../db/models');
const { Story } = db;
const { asyncHandler, csrfProtection } = require('./utils');
const { check, validationResult } = require('express-validator');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../auth');

// router.use(express.json())
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


router.get('/create', requireAuth, asyncHandler(async (req, res, next) => {
    const story = await Story.build();
    res.render('story-create', {
        csrfToken: req.csrfToken(),
        title: "Create a Story",
        story,
    })
}))



router.post('/create', requireAuth, csrfProtection, storyValidations, asyncHandler(async (req, res, next) => {
    const { title, content } = req.body;
    const story = Story.build({ userId: res.locals.user.id, title, content
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

module.exports = router;
