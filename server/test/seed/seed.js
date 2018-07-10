const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id : userOneId,
        email : 'andrew@example.com',
        password : 'userOnePass',
        tokens: [{
            access : 'auth',
            token : jwt.sign({_id : userOneId , access : 'auth'} , 'abc123').toString()
        }]
    },
    {
        _id : userTwoId,
        email : 'jean@example.com',
        password : 'userTwoPass',
    }
];

const todos = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 333
}];

const populateTodos = function(done) {
    console.log("Running populateTodos");
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
        done();
    }).catch((e) => done(e));
};

const populateUsers = function(done) {
    console.log("Running populateUsers");
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        /* 
        this "Promise" would be available to 
        WAIT for all User SAVE actions to complete. 
        */
        Promise.all([userOne , userTwo]);
        done();
    }).catch((e)=>{
        done(e);
    });
};

module.exports = {
    todos , populateTodos , users , populateUsers
}