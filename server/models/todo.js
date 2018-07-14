var mongoose = require('mongoose');

/*
    Mongoose Model :
    How to store the data
*/
var Todo = mongoose.model('todos', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }, 
    completedAt: {
        type: Number,
        default: null
    },
    // Create user type who created TODO
    creator : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
});

module.exports ={
    Todo
};