import nodemailer from "nodemailer";

// Setup transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Reusable sendMail function
export const sendMailer = async ({ to, subject ,HtmlMessage }) => {
  // Validate input
  if (!to || !subject) {
    throw new Error("Missing required fields: 'to' and 'subject'");
  }

    const StaticMessage = `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    padding: 20px;
    }
    .email-container {
        background-color: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h2 {
            color: #007bff;
            }
            p {
                font-size: 16px;
                color: #333;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #aaa;
                    }
                    </style>
                    </head>
                    <body>
                    <div class="email-container">
                    <h2>Welcome to Burkha!</h2>
                    <p>Thank you for reaching out to us. We're glad to have you here.</p>
                    <p>If you have any questions, just reply to this email. We're happy to help!</p>
                    <div class="footer">© 2025 Burkha Inc. All rights reserved.</div>
                    </div>
                    </body>
                    </html>
                    `;
  let commonHtmlMessage =StaticMessage ;

  if(HtmlMessage){
    commonHtmlMessage=HtmlMessage;
  }
  
  // Common email HTML content
         
                    const mailOptions = {
    from: `"Burkha" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: commonHtmlMessage
  };

 
  const info = await transporter.sendMail(mailOptions);
  return info; 
};
