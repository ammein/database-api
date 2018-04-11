var mongoose = require('mongoose');

// Setup to do promises for all our codes
mongoose.Promise = global.Promise;

module.exports = {
    mongoose
};