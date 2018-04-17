const validator = require('validator');
const mongoose = require('mongoose');

// User Model 
var User = mongoose.model('Users', {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique : true,
        validate : {
            validator : (value) =>{
                return validator.isEmail(value);
            },
            messages : '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
    },
    tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});

module.exports = {
    User
};