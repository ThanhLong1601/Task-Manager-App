const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
})

const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email,
        subject: 'Thanks for joining in!', 
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`, 
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        return info.response
    } catch (error) {
        throw error
    }
};

const sendCancellationEmail = async (email, name) => {
    const mailOptions = {
        from : process.env.EMAIL_USER,
        to: email,
        subject: 'Thanks for using app!',
        text: `Thank you ${name} for using our app. I hope to see you back sometime soon.`
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        return info.response
    } catch (error) {
        throw error
    }
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
