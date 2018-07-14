require('./config/config');
const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

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
// add authenticate as to make sure that the user has login
app.post('/todos' , authenticate, (req , res)=>{
    // Set properties and fetch text that we did
    var newTodo = new Todo({
        text : req.body.text,
        // Add Creator
        creator : req.user._id
    });
    // Save model to database
    newTodo.save().then((doc)=>{
        res.status(200).send(doc); // send to BODY
    },(e)=>{
        res.status(400).send(e);
    });
    // console.log(req.body);
});

// GET /todos/
app.get('/todos' ,authenticate, (req , res)=>{
    Todo.find({
        creator : req.user._id
    }).then((data)=>{
        // If you do res.send(data). It will return an array
        // Not a best practice , we have to make it an object
        res.send({data});
    },(err)=>{
        res.status(400).send(err);
    })
});


// GET/todos/:id
// : - Colon is returning id key so it would be like { id : value }
app.get('/todos/:id' , authenticate , (req , res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    };
    
    /* This one findById is not appropriate because it
    can access someone's else todos
    */
    Todo.findOne({
        _id : id,
        creator : req.user._id
    }).then((data)=>{
        if(!data){
            return res.status(404).send();
        }
        res.send({data});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.delete('/todos/:id',authenticate , (req , res)=>{
    // get id
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    // Change to findOneAndRemove
    Todo.findOneAndRemove({
        _id : id,
        creator : req.user._id
    }).then((data)=>{
        if(!data)
        {
            return res.status(404).send();
        }
        res.send({data});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});


app.patch('/todos/:id' , authenticate , (req , res)=>{
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
    Todo.findOneAndUpdate({_id : id , creator : req.user._id },{$set : body} , {new : true}).then((data)=>{
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

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login (email,password)
app.post('/users/login' , (req,res)=>{
    /* Find user who have a matching email sent 
    and hashed password that equals to plain text password
    (We are going to use compare hash function)
    */

    var body = _.pick(req.body , ['email' , 'password']);

    User.findByCredentials(body.email , body.password).then((user)=>{
        // skip catch and runs catch below as default
        return user.generateAuthToken().then((token)=>{
            // Send header token and user data
            res.header('x-auth',token).send(user);
        })
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.delete('/users/me/token' , authenticate, (req , res)=>{
    // Make this route private
    // The user have to be authenticated

    // Then DELETE the token
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },(e)=>{
        res.status(400).send();
    });
});

app.listen(port , ()=>{
    console.log(`Started on Port ${port}`);
});

module.exports = {
    app
};