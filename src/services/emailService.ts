import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface accessEmail {
  to: string;
  name: string;
  tempPassword: string;
}

export const sendAccessEmail = async ({
  to,
  name,
  tempPassword,
}: accessEmail) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  await transporter.sendMail({
    to,
    subject: "Your IT Asset System Access",
    html: `
        <h2>Hello ${name}</h2>
        <p>Your account has been created.</p>
        <p><b>Use this Temporary Password to Login:</b>${tempPassword}</p>
        <p><a href="${loginUrl}">Login Here</a></p>
        <p>You must change your password after login</p>
        `,
  });
};
