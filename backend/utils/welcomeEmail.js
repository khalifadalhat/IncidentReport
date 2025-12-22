const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendWelcomeEmail = async (email, fullname) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Welcome to Incidence Report System!";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
      <h2>Hello, ${fullname}!</h2>
      <p>Thank you for registering with us. Your account has been created successfully.</p>
      <p>We're excited to have you on board!</p>
      <p><a href="${process.env.FRONTEND_URL}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>The Incidence Report Team</p>
    </div>
  `;
  sendSmtpEmail.sender = { name: "Incidence Report Team", email: "no-reply@incidencereport.com" }; 
  sendSmtpEmail.to = [{ email }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Welcome email sent to:", email, "ID:", data);
  } catch (err) {
    console.error("Failed to send welcome email:", err.message || err);
  }
};

module.exports = { sendWelcomeEmail };