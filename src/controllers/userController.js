const User = require('../models/user')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findByCredentials(email, password)

        const token = await user.generateAuthToken()

        res.status(200).send({
            status: 'Success',
            message: 'Login Successful',
            data: {
                User: user,
                Token : token
            }
        })    
    } catch (error) {
        res.status(400).send({
            status: 'Error',
            message: 'Invalid email or password',
            data: null
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => tokenObj.token !== req.token)

        await req.user.save()

        res.status(200).send({
            status: 'Success',
            message: 'Logged out successfully',
            data: null
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: 'Logout failed',
            data: null
        })
    }
}

const logoutAll = async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.status(200).send({
            status: 'Success',
            message: 'Logged out from all devices successfully',
            data: null
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: 'Logout all failed',
            data: null
        })
    }
}

const createUser = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

        await sendWelcomeEmail(user.email, user.name)

        const token = await user.generateAuthToken()
        res.status(201).send({
            status: 'Success',
            message: 'User has been created',
            data: user,
            Token: token
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({
                status: 'Error',
                message: 'Invalid user data',
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

const getUser = async (req, res) => {
    try {
        res.status(200).send({
            status: 'Success',
            message: 'Your profile : ',
            data: req.user
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: 'Server Error',
            data: error.message
        })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send({
            status: 'Success',
            message: 'List of all users : ',
            data: users
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: 'Server Error',
            data: error.message
        })
    }
}

const updateUser = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            status: 'Error',
            message: 'Invalid updates',
            data: null
        })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        res.status(200).send({
            status: 'Success',
            message: 'Update completed user :',
            data: req.user
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

const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({_id: req.user._id})
        await sendCancellationEmail(req.user.email, req.user.name)
        res.status(200).send({
            status: 'Success',
            message: 'User has been deleted successfully!', 
            data: req.user
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: 'Server error',
            data: null
        })
    }
}

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('File upload failed')
        }

        const buffer = await sharp(req.file.buffer)
            .resize({width: 250, height: 250})
            .png()
            .toBuffer()

        req.user.avatar = buffer
        await req.user.save()

        res.status(200).send({
            status: 'Success',
            message: 'File upload successfully',
            data: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        })
    } catch (error) {
        res.status(400).send({
            status: 'Error',
            message: error.message,
            data: null
        })
    }
    
}

const deleteAvatar = async (req, res) => {
    try {
        if (!req.user.avatar) {
            throw new Error('User does not have an avatar to delete')
        }

        req.user.avatar = undefined
        await req.user.save()

        res.status(200).send({
            status: 'Success',
            message: 'Avatar have been deleted',
            data: null
        })
    } catch (error) {
        res.status(400).send({
            status: 'Error',
            message: error.message,
            data: null
        })
    }
}

const getAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png'); 
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send({
            status: 'Error',
            message: error.message,
            data: null
        });
    }
};


module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser, 
    deleteUser,
    loginUser,
    logoutUser,
    logoutAll,
    uploadAvatar,
    deleteAvatar,
    getAvatar
}