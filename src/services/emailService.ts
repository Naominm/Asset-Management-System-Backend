
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
} as nodemailer.TransportOptions);

interface AccessEmail {
  to: string;
  name: string;
  tempPassword: string;
}

export const sendAccessEmail = async ({
  to,
  name,
  tempPassword,
}: AccessEmail) => {
  try {
    const loginUrl = `${process.env.FRONTEND_URL}/login`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your IT Asset System Access",
      html: `<h2>Hello ${name}</h2>
             <p>Your account has been created.</p>
             <p><b>Use this Temporary Password:</b> ${tempPassword}</p>
             <p><a href="${loginUrl}">Login Here</a></p>`,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending access email:", error);
  }
};

export const notifyAdmin = async (fullName: string, email: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "naomimbugua349@gmail.com",
    subject: "New Access Request Pending",
    html: `<h2>New Access Request</h2>
           <p><b>User:</b> ${fullName}</p>
           <p><b>Email:</b> ${email}</p>
           <p>Please log in to the system to approve this request.</p>`,
  });
};
