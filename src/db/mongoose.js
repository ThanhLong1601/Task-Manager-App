const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to MongoDB!')
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error.message)
    }
}
connectDB()