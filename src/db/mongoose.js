const mongoose = require('mongoose')
require('dotenv').config()

// OLD WAY - USE PROMISE
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')
//     .then(() => {
//         console.log('Connected to MongoDB!')
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB: ', error.message)
//     })

// NEW WAY - USE async/await
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to MongoDB!')
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error.message)
    }
}
connectDB()