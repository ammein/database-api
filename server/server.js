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

app.post('/todos' , (req , res)=>{
    // Set properties and fetch text that we did
    var todo = new Todo({
        text : req.body.text
    });
    todo.save().then((data)=>{
        res.send(doc); // send to BODY
    },(err)=>{
        res.status(400).send(err);
    });
});

// GET /todos/


app.listen(3000 , ()=>{
    console.log("Started on Port 3000");
});