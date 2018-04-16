var mongoose = require('mongoose');

// Setup to do promises for all our codes
mongoose.Promise = global.Promise;
// remove local database URL
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
};

