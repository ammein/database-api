var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// POST (CREATE)
/*
    Use POST HTTP METHOD :
    - Send our JSON as BODY .
    - SERVER will fetch the BODY to make a model database.
    - SERVER will send back to body that we will fetch all the data back from SERVER
*/

// Using Middleware of bodyParser to make JSON
app.use(bodyParser.json());

// Send to server
app.post('/todos' , (req , res)=>{
    // Set properties and fetch text that we did
    var newTodo = new Todo({
        text : req.body.text
    });
    // Save model to database
    newTodo.save().then((doc)=>{
        res.send(doc); // send to BODY
    },(e)=>{
        res.status(400).send(e);
    });
    // console.log(req.body);
});

// GET /todos/
// app.get('/todos' , (req , res)=>{
//     console.log(req.body);
// });

app.listen(3000 , ()=>{
    console.log("Started on Port 8000");
});