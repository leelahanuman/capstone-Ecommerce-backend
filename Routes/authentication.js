const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "You have not entered required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      role,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "You have not entered required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

/* ================= GET USER ================= */
router.get("/getuser", async (req, res) => {
  try {
    const token = req.headers.authtoken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({ user: decoded });
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
