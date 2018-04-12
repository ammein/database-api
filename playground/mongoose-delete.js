const {mongoose} = require('./../server/db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({})
// Todo.remove({}).then((data)=>{
//     console.log(data);
// });


// .findOneAndRemove()\

Todo.findOneAndRemove({ _id: '5acf6285fbf99dd28e2d4678'}).then((data=>{
    console.log(data);
});
// .findByIdAndRemove()


Todo.findByIdAndRemove('5acf5caffbf99dd28e2d44de').then((doc)=>{
    console.log({doc});
});