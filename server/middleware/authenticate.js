var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    // Grab token
    var token = req.header('x-auth');

    // User schema find Token
    User.findByToken(token).then((user) => {
        if (!user) {
            res.status(401).send();
        }

        req.user = user;
        req.token = token;
        console.log("User : ( %s ) ",user);
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {
    authenticate
};