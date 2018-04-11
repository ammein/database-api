var mongoose = require('mongoose');

/*
    Mongoose Model :
    How to store the data
*/
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }, completedAt: {
        type: Number,
        default: null
    }
});

module.exports ={
    Todo
};