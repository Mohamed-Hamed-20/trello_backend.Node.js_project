import nodemailer from "nodemailer";

 const sendEmail = async ({ to, cc, bcc, subject, text, html , attachments =[] }={}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email,
      pass: process.env.Email_password,
    },
  });

  const info = await transporter.sendMail({
    from : `"BFCAI"<${process.env.Email}>`,
    to,
    subject,
    bcc,
    cc,
    text,
    html,
    attachments,
  });
  console.log(info);
};

export default sendEmail;