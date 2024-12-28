const multer = require('multer')

const errorHandlerMiddleware = (error, req, res, next) => {
    if (error instanceof multer.MulterError || error instanceof Error) {
        return res.status(400).send({
            status: 'Error',
            message: error.message,
            data: null,
        })
    }
    next()
}

module.exports = errorHandlerMiddleware