const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// beforeEach is a method to run for temporary for running once
// To make the database server empty for testing
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        done();
    });
});

// Test POST/todos
describe('POST/todos', ()=>{
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
            Todo.find({}).then((todos)=>{
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
                expect(data.length).toBe(0);
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });
});