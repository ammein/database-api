var mongoose = require('mongoose');

// Setup to do promises for all our codes
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};