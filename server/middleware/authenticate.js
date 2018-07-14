var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    // ONLY TO AUTHENTICATE
    // Grab token
    var token = req.header('x-auth');

    // User schema find Token
    User.findByToken(token).then((user) => {
        // Only to assign to user data and token
        if (!user) {
            res.status(401).send({
                "message" : "User not found"
            });
        }
        // Pass user data onto request API
        req.user = user;
        // Pass token data onto request API
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
        next();
    });
};

module.exports = {
    authenticate
};