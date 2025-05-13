const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "payasamkarthik122@gmail.com",
            pass: "kvyziaxmqaycsbkh" //in chrome first do the two setp verification and set the app password that password gave here
        }
    }
)

async function main(toMail, bodycontent) {
    try {
        const info = transporter.sendMail({
            from: '"payasam_products" <payasamkarthik122@gmail.com>',
            to: toMail,
            subject: "Hello Dear Customer",
            text: "hello world",
            html: bodycontent,
            attachments: [{
                filename: 'payasam-products.png',
                path: './images/payasam-products.png',
                cid: 'logo' //same cid value as in the html img src
            }]
        })
        console.log("message sent...", (await info).messageId);
    }
    catch (err) {
        throw err;
    }
}

module.exports = main 