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
        type : String
    },
    completed : {
        type : Boolean
    }, completedAt : {
        type : Number
    }
});

// Specify properties
var newTodo = new Todo({
    text : "Cook Dinner",
});

// Save to MongoDB database
newTodo.save().then((data)=>{
    console.log("Save todo",data);
},(e)=>{
    console.log("Unable to save to do");
}); 

// Create another toDo
var otherTodo = new Todo({
    text : "Other to do bro ?",
    completed : false,
    completedAt : 123
});

otherTodo.save().then((data)=>{
    console.log("Save other todo",JSON.stringify(data , undefined , 2));
},(e)=>{
    console.log("Unable to save other todo" , e);
})