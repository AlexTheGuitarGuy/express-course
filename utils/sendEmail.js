import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_EMAIL,
    SMTP_PASSWORD,
    FROM_NAME,
    FROM_EMAIL,
  } = process.env;

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let message = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log(`Message sent: ${info.messageId}`.green);
};

export default sendEmail;
