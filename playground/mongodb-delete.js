const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log("Unable to connect to server");
    }
    console.log("Connected to MongoDB server");
    const db = client.db('TodoApp');
    // deleteMany
    // db.collection('Todos').deleteMany({
    //     text : "Something to do"
    // }).then((data) =>{
    //     console.log("Data deleted count : ",data.result.ok);
    // });
    // deleteOne
    // db.collection('Todos').deleteOne({
    //     text : "Eat Dinner"
    // }).then((data) =>{
    //     console.log(data);
    // });
    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({completed:false}).then((data)=>{
        console.log(data);
    });

    // client.close(); 
});