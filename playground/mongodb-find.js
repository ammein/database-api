// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log("Unable to connect to server");
    }
    console.log("Connected to MongoDB server");

    const db = client.db('TodoApp');
    // Access Collection
    db.collection('Todos').find().toArray().then((data)=>{
        console.log('Todos');
        console.log(JSON.stringify(data , undefined , 2));
    },(err)=>{
        if(err)
        {
            console.log("Unable to fetch todos" , err);
        }
    });
    // client.close(); 
});