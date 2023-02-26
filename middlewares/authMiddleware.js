const User = require('../models/User');

module.exports = (req, res, next) => {
    User.findById(req.session.userID, (err, user) => {
        if (!user) return res.redirect('/login');
        next();
    });
};