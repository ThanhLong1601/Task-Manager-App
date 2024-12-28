const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    avatar: {
        type: Buffer
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [
            {
                validator: async function(value) {
                    if (this.isNew || this.isModified('email')) {
                        const user = await mongoose.models.User.findOne({email: value})
                        return !user
                    }
                    return true
                },
                message: 'Email cannot be duplicated'
            },
            {
                validator: (value) => validator.isEmail(value),
                message: 'Invalid email format!'
            }
        ]
    },
    age: {
        type: Number,
        default: 0,
        min: [0, 'Age must be at least 0']
    },
    password: {
        type: String,
        required: true,
        minlength: [7, 'Password is more than 6 characters '],
        trim: true,
        validate: {
            validator: (value) => !value.toLowerCase().includes('password'),
            message: 'Password must not contain the word "password"'
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// Hash password before saving
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

// Delete user tasks when user is remove
userSchema.pre('deleteOne', {document: false, query: true}, async function (next) {
    const userId = this.getFilter()._id

    await Task.deleteMany({ owner: userId })

    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString(),
        email: user.email
    },
    process.env.JWT_SECRET_KEY,
    {expiresIn: '15m'}
    )

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

const User = mongoose.model('User', userSchema)


module.exports = User