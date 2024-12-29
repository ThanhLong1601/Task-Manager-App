const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const mongoose = require('mongoose');
const { 
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase 
}  = require('./fixtures/db')

beforeEach(setupDatabase)

afterAll(async () => {
    await mongoose.connection.close();
});

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body.task._id)
    expect(task).not.toBeNull()
    expect(task.complete).toEqual(false)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.data.length).toEqual(2)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/api/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})