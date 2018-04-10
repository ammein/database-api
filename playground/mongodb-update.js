const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log("Unable to connect to server");
    }
    console.log("Connected to MongoDB server");
    const db = client.db('TodoApp');
    // findOneAndUpdate
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5accc20ba86f3d2618d31529')
    }, {
        // Google MongoDB Update Operator
        $set : {
            completed : true
        }
    },{
        returnOriginal : false
    }).then((data)=>{
        console.log(data);
    });

    // client.close(); 
});