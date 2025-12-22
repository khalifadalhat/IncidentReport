const brevo = require("@getbrevo/brevo");
const OTP = require("../models/otp");

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(0, process.env.BREVO_API_KEY);

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
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  sendSmtpEmail.sender = {
    name: "Incidence Report",
    email: "khalifadalhat@gmail.com",
  };
  sendSmtpEmail.to = [{ email: email }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      "OTP email sent successfully to:",
      email,
      "MessageId:",
      data.messageId
    );
  } catch (err) {
    if (err.response) {
      console.error("Brevo API Error Status:", err.response.status);
      console.error(
        "Brevo API Error Body:",
        err.response.body || err.response.data
      );
    } else {
      console.error("OTP Email error:", err.message || err);
    }
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
