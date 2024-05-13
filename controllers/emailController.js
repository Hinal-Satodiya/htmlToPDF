const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'hsatodiya.netclues@gmail.com',
        pass: 'tahh bkle edmi snqm'
    }
});

function sendEmail(file, to, subject, text, callback) {
    // if (!file || !to || !subject || !text) {
    //     return callback('Missing file, recipient email to, subject, or text.');
    // }

    const filename = file.filename.split(".")[0];

    const mailOptions = {
        from: 'hsatodiya.netclues@gmail.com',
        to: to,
        subject: subject,
        // text: text,
        attachments: [
            {
                filename: `${filename}.pdf`,
                path: `assets/${filename}.pdf`
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return callback('Failed to send email.');
        }
        callback(null, 'Email sent successfully.');
    });
}

module.exports = {
    sendEmail
};
