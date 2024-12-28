const express = require('express')
require('./db/mongoose.js')
const userRouter = require('./routes/userRoutes.js')
const taskRouter = require('./routes/taskRoutes.js')
require('dotenv').config();

const app = express()

app.use(express.json())

app.use('/api', userRouter)
app.use('/api', taskRouter)

module.exports = app

