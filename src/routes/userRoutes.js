const express = require('express')
const {
    loginUser, 
    logoutUser, 
    logoutAll, 
    createUser, 
    getUser, 
    getUsers, updateUser, deleteUser, uploadAvatar, deleteAvatar, getAvatar} = require('../controllers/userController')
const auth = require('../middleware/auth')
const multer = require('multer')
const errorHandlerMiddleware = require('../middleware/errorHandlerMiddleware')

const userRouter = express.Router()

// Login
userRouter.post('/users/login', loginUser)

// Logout
userRouter.post('/users/logout', auth, logoutUser)

// Logout ALL
userRouter.post('/users/logoutAll', auth, logoutAll)

//Create User
userRouter.post('/users', createUser)

// Get Profile User
userRouter.get('/users/me', auth, getUser)

//Get All User
userRouter.get('/users', auth, getUsers)

// Update User
userRouter.patch('/users/me', auth, updateUser)

// Delete User
userRouter.delete('/users/me', auth, deleteUser)


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an images'))
        }
        cb(null, true)
    }
})
userRouter.post('/users/me/avatar', auth, upload.single('avatar'), uploadAvatar)    

userRouter.use(errorHandlerMiddleware)

userRouter.delete('/users/me/avatar', auth, deleteAvatar)    

userRouter.get('/users/:id/avatar', getAvatar)


module.exports = userRouter
