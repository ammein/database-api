require('./config/config');
const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id' , (req , res)=>{
    // get id
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((data)=>{
        if(!data)
        {
            res.status(404).send();
        }
        res.send({data});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});


app.patch('/todos/:id' , (req , res)=>{
    var id = req.params.id;
    // Set only properties that user would want to update the data using lodash
    var body = _.pick(req.body , ['text' , 'completed']);
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    // Checking if the completed statement is a boolean
    if(_.isBoolean(body.completed) && body.completed)
    {
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    // new is similar to returnOriginal method in MongoDB
    Todo.findByIdAndUpdate(id ,{$set : body} , {new : true}).then((data)=>{
        if(!data)
        {
            return res.status(404).send();            
        }
        res.send({data});
    }).catch((e)=>{
        res.status(400).send();
    });
});

// POST /users
app.post('/users' , (req ,res)=>{
    var body = _.pick(req.body , ['email' , 'password']);
    var user = new User(body);


    user.save().then(()=>{
        return user.generateAuthToken();        
    }).then((token)=>{
        // send HTTP back to headers
        res.header('x-auth' , token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// GET users/me
/*
    This route is going to require authentication. 
    Which means you're going to need to provide a valid x-auth token.

    It's going to find the associate User and it's going to send that user back. Much like we send as above
*/
app.get('/users/me' ,authenticate , (req , res)=>{
    res.send(req.user);
});

app.listen(port , ()=>{
    console.log(`Started on Port ${port}`);
});

module.exports = {
    app
};