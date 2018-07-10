const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const bcrypt = require('bcryptjs');

// Define properties/data type using schema method
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            messages: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// set custom values API
UserSchema.methods.toJSON = function () {
    var user = this;
    // To convert string API into object
    var userObject = user.toObject();
    // Select only the object we need
    return _.pick(userObject , ['_id' , 'email']);
};

// .method(object)
// .generateAuthToken -> Instance Method
UserSchema.methods.generateAuthToken = function () { 
    var user = this;
    // get access of tokens
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();
    // updates user token array
    user.tokens = user.tokens.concat([{access , token}]);
    // save to database
    return user.save().then(()=>{
        return token;
    });
};

/* 
 .statics kind of methods that from model methods ,
 into instance method 
*/
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    /* 
    using undefined decoded is because jwt.verify is going to 
    throw an error. We are going to use try and catch block
    */
    try {
        decoded = jwt.verify(token, 'abc123');
        // Using return because we are going to use promise
        return User.findOne({
            _id: decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        });
    } catch (err) {
        // Return promise reject async code
        return Promise.reject(err);
    }
};

UserSchema.pre('save',function(next){
    var user = this;

    // isModified , takes one property and return true/false
    if(user.isModified('password')){
        bcrypt.genSalt(10 , (err , salt)=>{
            bcrypt.hash(user.password , salt , (err,result)=>{
                user.password = result;
                next();
            });
        });
        // access password via user.password
        // set user.password = hash;
    }else{
        next();
    }
});

// User Model 
var User = mongoose.model('Users', UserSchema);

module.exports = {
    User
};