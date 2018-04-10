var mongoose = require('mongoose');

// Setup to do promises for all our codes
mongoose.Promise = global.Promise;

// Connect Database
mongoose.connect('mongodb://localhost:27017/TodoApp');

/*
    Mongoose Model :
    How to store the data
*/
var Todo = mongoose.model('Todo' , {
    text : {
        type : String,
        required : true,
        minLength : 1,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    }, completedAt : {
        type : Number,
        default : null
    }
});

// Create another toDo
// var otherTodo = new Todo({
//     text : "  Edit this video   "
// });

// otherTodo.save().then((data)=>{
//     console.log("Save other todo",JSON.stringify(data , undefined , 2));
// },(e)=>{
//     console.log("Unable to save other todo" , e);
// });


// User Model 
var user = mongoose.model('User',{
    email : {
        type : String,
        required : true,
        trim : true,
        minLength : 1
    }
});

var newUser = new user({
    email : "aminshazrin@yahoo.com"
});


newUser.save().then((data)=>{
    console.log(JSON.stringify(data , undefined,2));
},(error) =>{
    console.log("Unable to save user" , error);
});