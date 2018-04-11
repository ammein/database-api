const {mongoose} = require('./../server/db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../server/models/todo');

var id = '5ace3ea4a0a9fe1bc0883afc11';

// ID Validators
if(!ObjectID.isValid(id)){
    console.log("ID not valid");
};
// Simple find method
Todo.find({
    _id : id
}).then((todo)=>{
    console.log("Todos",todo);
});
// Simple findOne method
Todo.findOne({
    _id : id
}).then((data)=>{
    console.log(data);
});
// Most Recommend Method for Find By ID
Todo.findById(id).then((todoByID)=>{
    if(!todoByID)
    {
        return console.error("Id not found");
    }
    console.log(todoByID);
}).catch((e)=>{
    console.log(e);
});