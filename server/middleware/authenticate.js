var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    // Grab token
    var token = req.header('x-auth');

    // User schema find Token
    User.findByToken(token).then((user) => {
        if (!user) {
            res.status(401).send({
                "message" : "User not found"
            });
        }

        req.user = user;
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