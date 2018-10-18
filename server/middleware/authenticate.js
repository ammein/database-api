var {User} = require('./../models/user');

var authenticate = async (req, res, next) => {
    // ONLY TO AUTHENTICATE
    // Grab token
    const token = req.header('x-auth');

    try {
        const user = await User.findByToken(token);
        // Only to assign to user data and token
        if (!user) {
            res.status(401).send({
                "message": "User not found"
            });
        }
        // Pass user data onto request API
        req.user = user;
        // Pass token data onto request API
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send();
        next();
    }
};

module.exports = {
    authenticate
};