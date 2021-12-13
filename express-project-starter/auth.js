const db = require('./db/models');
const { use } = require('./routes');

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id,
    };
};



module.exports = {
    loginUser
};
