const brevo = require("@getbrevo/brevo");
const OTP = require("../models/OTP");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey, 
  process.env.BREVO_API_KEY
);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose) => {
  const purposes = {
    registration: "Account Registration",
    "password-reset": "Password Reset",
    "password-change": "Password Change",
  };

  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = `${purposes[purpose]} - OTP Verification`;
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>${purposes[purpose]}</h2>
      <p>Your OTP code is:</p>
      <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;
  sendSmtpEmail.sender = { name: "Support", email: "khalifadalhat@gmail.com" };
  sendSmtpEmail.to = [{ email: email }];

  try {
    // 3. Just call the method on the instance we already configured
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Success! Message ID:", data.body.messageId);
  } catch (err) {
    console.error("Error:", err.response?.body || err.message);
  }
};

const createOTP = async (email, purpose) => {
  await OTP.deleteMany({ email, purpose });

  const otp = generateOTP();

  await OTP.create({
    email,
    otp,
    purpose,
  });

  await sendOTPEmail(email, otp, purpose);

  return otp;
};

const verifyOTP = async (email, otp, purpose) => {
  const otpRecord = await OTP.findOne({
    email,
    otp,
    purpose,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    return { success: false, message: "Invalid or expired OTP" };
  }

  otpRecord.verified = true;
  await otpRecord.save();

  return { success: true, message: "OTP verified successfully" };
};

const isOTPVerified = async (email, purpose) => {
  const otpRecord = await OTP.findOne({
    email,
    purpose,
    verified: true,
    expiresAt: { $gt: new Date() },
  });

  return !!otpRecord;
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  createOTP,
  verifyOTP,
  isOTPVerified,
};
