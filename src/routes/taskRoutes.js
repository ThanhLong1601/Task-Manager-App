const express = require('express')
const {createTask, getTasks, getTaskById, updateTask, deleteTask} = require('../controllers/taskController')
const auth = require('../middleware/auth')

const taskRouter = express.Router()

taskRouter.post('/tasks', auth, createTask)

taskRouter.get('/tasks', auth, getTasks)

taskRouter.get('/tasks/:id', auth, getTaskById)

taskRouter.patch('/tasks/:id', auth, updateTask)

taskRouter.delete('/tasks/:id', auth, deleteTask)

module.exports = taskRouter
