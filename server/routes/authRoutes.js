const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    console.log("=== REGISTRATION REQUEST RECEIVED ===");
    console.log("Request body:", req.body);
    
    const { name, email, password, phone, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name, email, password });
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      role: role || "customer",
    };

    console.log("Creating user:", { name: userData.name, email: userData.email, role: userData.role });

    const newUser = new User(userData);
    await newUser.save();

    // Generate token
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "your_secret_key_here",
      {
        expiresIn: "7d",
      }
    );

    console.log("User created successfully:", newUser._id);

    // Return response
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || "",
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error during registration",
      error: error.message,
    });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST RECEIVED ===");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "your_secret_key_here",
      {
        expiresIn: "7d",
      }
    );

    console.log("Login successful for:", email);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error during login",
    });
  }
});

// GET USER PROFILE
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key_here");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;