const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Register User — Send Verification Email
exports.registerUser = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });
  
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

  const url = `http://localhost:${process.env.PORT}/api/verify-registration?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verify your registration",
      html: `<p>Click <a href="${url}">here</a> to verify your registration. This link expires in 15 minutes.</p>`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ message: "Email failed", error: err.message });
  }
};

// Verify Token and Register User (with password)
exports.verifyUser = async (req, res) => {
  const { token, password } = req.body;

  if (!token) return res.status(400).json({ message: "Token missing" });
  if (!password) return res.status(400).json({ message: "Password required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already verified" });
    }

    const user = new User({ email, password });
    await user.save();

    res.status(200).json({ message: "Email verified. User registered." });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
};

// Login User and return JWT token
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
