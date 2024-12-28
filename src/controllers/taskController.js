const mongoose = require('mongoose')
const Task = require('../models/task')

const createTask = async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send({
            status: 'Success',
            message: 'Task has been created',
            data: task
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({
                status: 'Error',
                message: 'Invalid task data',
                data: error.message
            })
        }
        res.status(500).send({
            status: 'Error',
            message: 'Server error',
            data: null
        })
    }
}

// GET /tasks?complete=true
const getTasks = async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.complete) {
        match.complete = req.query.complete === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit) || 5,
                skip: parseInt(req.query.skip) || 0,
                sort
            }
        })
        res.status(200).send({
            status: 'Success',
            message: 'List of all tasks : ',
            data: req.user.tasks
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error', 
            message: 'Server error',
            data: null
        })
    }
}

const getTaskById = async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            return res.status(404).send({
                status: 'Error',
                message: 'Task not found!',
                data: null
            })
        }
        
        res.status(200).send({
            status: 'Success',
            message: 'Information of task : ',
            data: task
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error', 
            message: 'Server error',
            data: null
        })
    }
}

const updateTask = async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'complete']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            status: 'Error',
            message: 'Invalid updates',
            data: null
        })
    }

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({
            status: 'Error',
            message: 'Invalid ID format!',
            data: null
        })
    }
    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            return res.status(404).send({
                status: 'Error',
                message: 'Task not found!',
                data: null
            })
        }

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()
        res.status(200).send({
            status: 'Success',
            message: 'Update completed task :',
            data: task
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({
                status: 'Error',
                message: 'Bad Request',
                data: error.message
            })
        }
        res.status(500).send({
            status: 'Error',
            message: 'Server error',
            data: null
        })
    }
}

const deleteTask = async (req, res) => {
    const _id = req.params.id

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({
            status: 'Error',
            message: 'Invalid ID format!',
            data: null
        })
    }

    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({
                status: 'Error',
                message: 'Task not found!',
                data: null
            })
        }

        res.status(200).send({
            status: 'Success',
            message: 'Task has been deleted successfully!', 
            data: task
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: 'Server error',
            data: null
        })
    }
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
}