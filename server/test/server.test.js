const {beforeEach , describe} = require('mocha');
const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {MongoClient , ObjectID} = require('mongodb');
const {todos , populateTodos , users , populateUsers} = require('./seed/seed');

// beforeEach is a method to run for temporary for running once
// To make the database server empty for testing

// Test POST/todos

describe('POST /todos', () => {
    beforeEach(populateTodos);
    it('should create new todo', (done) => {
        // async code
        var text = 'Test new post';
        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                // Expect the text is equal to above
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                /* 
                Not done yet.Instead make it done , we have to do callback for error and respond.
                */
                if (err) {
                    return done(err);
                }
                // Also to detect our server has its data
                return Todo.find({
                    text
                }).then((doc) => {
                    expect(doc.length).toBe(1);
                    expect(doc[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({}).then((data) => {
                    expect(data.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe('GET /todos', () => {
    beforeEach(populateTodos);
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBe(2);
            })
            .end(done);
    });
});


describe('GET /todos/:id', () => {
    beforeEach(populateTodos);
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        // make sure get 404 back
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        // todos/123
        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    beforeEach(populateTodos);
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                };

                //query database using findById()
                Todo.findById({_id : hexId}).then((data) => {
                    // If deleted it , it should not exist
                    expect(data).toNotExist();
                    // console.log(done(data));
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return 404 if todo not found', (done) => {
        // make sure get 404 back
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        // todos/123
        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    beforeEach(populateTodos);
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = "dummy text testing update";
        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({
                completed: true,
                text
            })
            .expect((res) => {
                expect(res.body.data.text).toBe(text);
                expect(res.body.data.completed).toBe(true);
                expect(res.body.data.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = "A different kind of text";
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.data.text).toBe(text);
                expect(res.body.data.completed).toBe(false);
                expect(res.body.data.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('GET /users/me' , ()=>{
    beforeEach(populateUsers);
    it('should return user if authenticated' , (done)=>{
        request(app)
            .get('/users/me')
            // Set Headers
            .set('x-auth' , users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated' , (done)=>{
        // GET request
        // don't set headers for x-auth token
        // expect get 401
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users' , ()=>{
    it('should create a user' , (done)=>{
        // require unique valid email
        var email = 'example@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email , password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e)=>{
                    done(e);
                });
            });
    });

    it('should return validation errors if request invalid' , (done)=>{

    });

    it('should not create user if email in use' , (done)=>{

    });
});