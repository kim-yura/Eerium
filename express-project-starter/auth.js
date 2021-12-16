//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const db = require('./db/models');

//-------------------------------------------------------------------MIDDLEWARE AND AUTH FUNCTIONS------------------------------------------------------------------//

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id,
    };
};

const logoutUser = (req, res) => {
    delete req.session.auth;
};

const restoreUser = async (req, res, next) => {
    // Log the session object to the console
    // to assist with debugging.
    // console.log(req.session);

    if (req.session.auth) {
        const { userId } = req.session.auth;
        console.log(req.session)
        try {
            const user = await db.User.findByPk(userId);

            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;
                // console.log(res.locals.authenticated);
                console.log(`.....................................`)
                console.log(res.locals.user.id);
                next();
            }
        } catch (err) {
            res.locals.authenticated = false;
            next(err);
        }
    } else {
        res.locals.authenticated = false;
        next();
    }
};

const requireAuth = (req, res, next) => {
    console.log("test", res.locals);
    if (!res.locals.authenticated) {
        return res.redirect('/users/login');
    }
    return next();
};

module.exports = {
    loginUser,
    logoutUser,
    requireAuth,
    restoreUser
};
