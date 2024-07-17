const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD
    }
});

const emailTemplates = { //defines two templates for resolved and underprocess status
    resolved: (name) => ({
        subject: "Status of your query",
        text: `Dear ${name}, \n\nWe have successfully resolved your query. Thanks for your patience.\n\nBest regards,\nMetis dev club`,
        html: `<p>Dear ${name},</p><p>We have successfully resolved your query. Thanks for your patience.</p><p>Best regards,<br>Metis dev club</p>`
    }),
    underProcess: (name) => ({
        subject: "Status of your query",
        text: `Dear ${name},\n\nWe are currently processing your query and will update you shortly.\n\nBest regards,\nMetis dev club`,
        html: `<p>Dear ${name},</p><p>We are currently processing your query and will update you shortly.</p><p>Best regards,<br>Metis dev club</p>`
    })
};


//sends an email based on the provided email,name,type
//uses an appropriate template based on the type.
const sendMail = async (email, name, type) => {
    const { subject, text, html } = emailTemplates[type](name);
    const mailOptions = {
        from: `Karthikeya <${process.env.USER}>`,
        to: email,
        subject,
        text,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Mail has been sent");
    } catch (error) {
        console.error("Error sending mail", error);
    }
};

module.exports = sendMail; // Exported and used in server.js


