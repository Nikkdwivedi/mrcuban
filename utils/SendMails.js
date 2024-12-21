import { createTransport } from "nodemailer";

export const sendMails = async (email, subject, html) => {

  const transport = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASSKEY,
    },
    port: 465,
    host: "smtp.gmail.com",
    tls: { rejectUnauthorized: false },
  });

  await transport.sendMail({
    from: "amazonego23@gmail.com",
    to: email,
    subject,
    html: html,
  });


};

export const sendDevMail = async (email, subject, html) => {

  const transport = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_DEV_ACCOUNT,
      pass: process.env.GMAIL_DEV_PASSKEY,
    },
    port: 465,
    host: "smtp.gmail.com",
    tls: { rejectUnauthorized: false },
  });

  await transport.sendMail({
    from: "mrcubandev@gmail.com",
    to: email,
    subject,
    html: html,
  });


};



// atrsrivjusmxpbhs.com
// "amazonego23@gmail.com"