const nodemailer = {
    createTransport: jest.fn(() => ({
        sendMail: jest.fn((mailOptions) => {
            return Promise.resolve({
                response: '250 OK: Message accepted',
            });
        }),
    })),
};

module.exports = nodemailer;
