// const MongoClient = require('mongodb').MongoClient;
const {MongoClient , ObjectID} = require('mongodb');
// ES6 Restructuring Object
var user = {name : "Amin" , age : 24};
var {name} = user; 
// {setWhatEver Key you want to restructre}
// equal to = WhatEver Object You want to restructure
// console.log(name);
// var obj = new ObjectID(); // Must create an Instance
// console.log(ObjectID);

// To connect to database 
// Takes two argument , First take a url , second callback function (If connected succeeded , console log)
// To connect to database , we have to use MongoDB protocol = mongodb://
// The port is your mongodb port
// Then we have to specify WHICH database we want to connect to by using forward slash '/'
MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err , client) => {
    if (err){
        return console.log("Unable to connect to server");
    }
    console.log("Connected to MongoDB server");
    // .collection(string)
    // .insertOne(object , (callback)) -- Insert New Document
    // Callback -> Fired or Failed
    // client.db(callingReferenceFor)
    const db = client.db('TodoApp');
    db.collection('Todos').insertOne({
        text : 'Something to do',
        completed : true
    },(err , result) => {
        if(err){
            return console.log("Unable to insert todo" , err);
        }
        console.log("Success" , JSON.stringify(result.ops , undefined , 2));
        // .ops -> store all of the docs that were inserted
    });

    db.collection('Users').insertOne({
        name : 'Amin Shazrin',
        age : 24,
        location : 'No 28 Jalan SG 7/18 Taman Sri Gombak'
    }, (err , result) =>{
        if(err)
        {
            return console.log("Unable to insert user" , err);
        }
        console.log(JSON.stringify(result.ops , undefined , 2));
        console.log(result.ops[0]._id.getTimestamp());
    });
    client.close(); // Close Connection DB Server
});