const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendLoginNotification = async (email, fullname) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Welcome Back to Incidence Report!";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
      <h2>Successful Login</h2>
      <p>Hello ${fullname},</p>
      <p>You've just logged in successfully at ${new Date().toLocaleString()}.</p>
      <p>If this wasn't you, please secure your account immediately.</p>
      <p>Best regards,<br>The Incidence Report Team</p>
    </div>
  `;
  sendSmtpEmail.sender = {
    name: "Incidence Report Team",
    email: "no-reply@incidencereport.com",
  };
  sendSmtpEmail.to = [{ email }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Welcome email sent to:", email, "ID:", data);
  } catch (err) {
    console.error("Failed to send welcome email:", err.message || err);
  }
};

module.exports = { sendLoginNotification };
