const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const generatePassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const sendCredentialsEmail = async (email, fullname, password, department) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Your Agent Account Credentials";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
      <h2>Welcome, ${fullname}!</h2>
      <p>Your agent account has been created successfully.</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> <code>${password}</code></p>
        <p><strong>Department:</strong> ${department}</p>
      </div>
      <p><strong>Important:</strong> Please change your password immediately after logging in.</p>
      <p><a href="${process.env.FRONTEND_URL}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
      <p>Best regards,<br>Admin Team</p>
    </div>
  `;
  sendSmtpEmail.sender = {
    name: "Support Team",
    email: "no-reply@incidencereport.com",
  };
  sendSmtpEmail.to = [{ email: email }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Credentials email sent to:", email, "ID:", data);
  } catch (err) {
    console.error("Failed to send credentials email:", err.message || err);
  }
};

module.exports = { generatePassword, sendCredentialsEmail };
