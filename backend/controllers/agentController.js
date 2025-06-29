const Agent = require('../models/agent');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate random password
const generatePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Send email with credentials
const sendCredentialsEmail = async (email, fullname, password, department, role) => {
  const mailOptions = {
    from: `"Customer Support" <process.env.EMAIL_USER>`,
    to: email,
    subject: 'Your Agent Account Credentials - Welcome to the Team!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Support Team!</h2>
        <p>Dear ${fullname},</p>
        <p>Your agent account has been successfully created. Here are your login credentials:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Login Details:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Role:</strong> ${role}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
        </div>
        
        <p>You can now log in to the system using these credentials.</p>
        <p>If you have any questions or need assistance, please contact your supervisor.</p>
        
        <p>Best regards,<br>Admin Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

exports.createAgent = async (req, res) => {
  try {
    const { fullname, email, department, role } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ error: 'Agent with this email already exists' });
    }

    // Generate random password
    const generatedPassword = generatePassword();

    // Create new agent
    const newAgent = new Agent({
      fullname,
      email,
      password: generatedPassword,
      department,
      role,
    });

    await newAgent.save();

    // Send email with credentials
    await sendCredentialsEmail(email, fullname, generatedPassword, department, role);

    // Return agent data without password
    const agentResponse = {
      _id: newAgent._id,
      fullname: newAgent.fullname,
      email: newAgent.email,
      department: newAgent.department,
      role: newAgent.role,
      status: newAgent.status,
      createdAt: newAgent.createdAt,
    };

    res.status(201).json({
      agent: agentResponse,
      message: 'Agent created successfully and credentials sent via email',
    });
  } catch (err) {
    console.error('Error creating agent:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.status(200).json({ agents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id).select('-password');
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.status(200).json({ agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, department, role } = req.body;
    const updatedAgent = await Agent.findByIdAndUpdate(
      id,
      { fullname, email, department, role },
      { new: true }
    ).select('-password');
    res.status(200).json({ agent: updatedAgent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    await Agent.findByIdAndDelete(id);
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reset password endpoint
exports.resetAgentPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const newPassword = generatePassword();
    agent.password = newPassword;
    agent.isFirstLogin = true;
    await agent.save();

    await sendCredentialsEmail(
      agent.email,
      agent.fullname,
      newPassword,
      agent.department,
      agent.role
    );

    res.status(200).json({ message: 'Password reset successfully and sent via email' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
