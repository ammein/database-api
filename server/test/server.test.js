const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {MongoClient , ObjectID} = require('mongodb');
// Dummy todos
const todos = [{
    text : "First test todo"
},{
    text : "Second test todo"
}];

// Insert ID database
var database = () => {
    MongoClient.connect('mongodb://localhost:3000/TodoApp', (err, client) => {
        if (err) {
            console.log("Cannot connect to TodoApp");
        }
        const db = client.db('TodoApp');
        db.collection('todos').insertOne({
            id
        }, (err, result) => {
            if (err) {
                console.log("Cannot insert ID");
            }
            console.log(result);
        });
        client.close();
    });
}


// beforeEach is a method to run for temporary for running once
// To make the database server empty for testing


// Test POST/todos
describe('POST/todos', ()=>{
    beforeEach((done) => {
        Todo.remove({}).then(() => {
            return Todo.insertMany(todos , done());
        }).catch(()=> done());
    });
    it('should create new todo' , (done)=>{
        // async code
        var text = 'Test new post';
        request(app)
        .post('/todos')
        .send({
            text
        })
        .expect(200)
        .expect((res)=>{
            // Expect the text is equal to above
            expect(res.body.text).toBe(text);
        })
        .end((err , res)=>{
            /* 
            Not done yet.Instead make it done , we have to do callback for error and respond.
            */
            if(err)
            {
                return done(err);                
            }
            // Also to detect our server has its data
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });
    it('should not create todo with invalid body data' , (done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err , res)=>{
            if(err)
            {
                return done(err);
            }
            Todo.find({}).then((data)=>{
                expect(data.length).toBe(2);
            }).then((e) => {
                done(e);
            });
        });
    });
});

describe('GET /todos' , ()=>{
    it('should get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.data.length).toBe(2);
        })
        .end(done);
    });

    it('should get specific id' , (done)=>{
        before((done)=>{
            var id = '123';
            database(id);
        });
        request(app)
        .get('/todos/:id')
        .expect(404)
        .expect((req , res)=>{
            expect(req.params.id).toBe(req.params.id);
            console.log(req.params);
        })
        .end(done);
    });
});