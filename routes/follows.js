//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { sequelize, User, Follow } = require('../db/models');
const { asyncHandler, csrfProtection, handleValidationErrors } = require('./utils');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../auth');

router.put("/newFollow", asyncHandler(async (req, res) => {
    const followerId = req.session.auth.userId;
    //const creatorId = res.locals.user.id;
    const { creatorId } = req.body;
    const follow = await Follow.findOne({
        where: {creatorId, followerId}
    })
    if (!follow) {
        await Follow.create({
            creatorId,
            followerId
        });
        res.json({ message: "Followed" })
    } else {
        await follow.destroy();
        res.json({message: "Unfollowed"})
    }
}))

module.exports = router;
