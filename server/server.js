var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();

const port = process.env.PORT || 3000;

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
app.get('/todos' , (req , res)=>{
    Todo.find({}).then((data)=>{
        // If you do res.send(data). It will return an array
        // Not a best practice , we have to make it an object
        res.send({data});
        console.log(data);
    },(err)=>{
        res.status(400).send(err);
    })
});


// GET/todos/:id
// : - Colon is to request specific key
app.get('/todos/:id' , (req , res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    };
    Todo.findById(id).then((data)=>{
        if(!data){
            return res.status(404).send();
        }
        res.send({data});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.listen(port , ()=>{
    console.log(`Started on Port ${port}`);
});

module.exports = {
    app
};