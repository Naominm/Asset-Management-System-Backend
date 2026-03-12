import nodemailer from "nodemailer";

// Use SMTP settings instead of "service: gmail" for better reliability
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password!
  },
});

interface AccessEmail {
  to: string;
  name: string;
  tempPassword: string;
}

// 1. Email for the User (After Approval)
export const sendAccessEmail = async ({
  to,
  name,
  tempPassword,
}: AccessEmail) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your IT Asset System Access",
    html: `<h2>Hello ${name}</h2>
           <p>Your account has been created.</p>
           <p><b>Use this Temporary Password:</b> ${tempPassword}</p>
           <p><a href="${loginUrl}">Login Here</a></p>`,
  });
};

// 2. Email for YOU (The Admin)
export const notifyAdmin = async (fullName: string, email: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "naomimbugua349@gmail.com", // YOUR EMAIL
    subject: "⚠️ New Access Request Pending",
    html: `<h2>New Access Request</h2>
           <p><b>User:</b> ${fullName}</p>
           <p><b>Email:</b> ${email}</p>
           <p>Please log in to the system to approve this request.</p>`,
  });
};
