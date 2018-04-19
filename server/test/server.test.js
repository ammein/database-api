const {beforeEach , describe} = require('mocha');
const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {MongoClient , ObjectID} = require('mongodb');
// Dummy todos
const todos = [{
    _id : new ObjectID(),
    text : "First test todo"
},{
    _id : new ObjectID(),
    text : "Second test todo",
    completed : true,
    completedAt : 333
}];


// beforeEach is a method to run for temporary for running once
// To make the database server empty for testing


// Test POST/todos
describe('POST/todos', ()=>{
    beforeEach((done) => {
        Todo.remove({}).then(() => {
            return Todo.insertMany(todos);
        }).catch((e)=> done(e));
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
        .end(done());
    });
});


describe('GET /todos/:id' , ()=>{
    it('should return todo doc' , (done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found' , (done)=>{
        // make sure get 404 back
        var hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done());
    });

    it('should return 404 for non-object ids' , (done)=>{
        // todos/123
        request(app)
        .get('/todos/123abc')
        .expect(404)
        .end(done());
    });
});


describe('DELETE /todos/:id' , ()=>{
    it('should remove a todo' , (done)=>{
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.data._id).toBe(hexId);
        })
        .end((err ,res)=>{
            if(err)
            {
                return done(err);
            };

            //query database using findById()
            Todo.findById(hexId).then((data)=>{
                // If deleted it , it should not exist
                expect(data).toNotExist();
                // console.log(done(data));
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });

    it('should return 404 if todo not found' , (done)=>{
        // make sure get 404 back
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid' , (done)=>{
        // todos/123
        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', ()=>{
    it('should update the todo' , (done)=>{
        var id = todos[0]._id.toHexString();
        var text = "dummy text testing update";
        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({
                completed : true,
                text
            })
            .expect((res)=>{
                expect(res.body.data.text).toBe(text);
                expect(res.body.data.completed).toBe(true);
                expect(res.body.data.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed' , (done)=>{
        var id = todos[1]._id.toHexString();
        var text = "A different kind of text";
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed : false,
                text
            })
            .expect(200)            
            .expect((res)=>{
                expect(res.body.data.text).toBe(text);
                expect(res.body.data.completed).toBe(false);
                expect(res.body.data.completedAt).toNotExist();
            })
            .end(done);
    });
});