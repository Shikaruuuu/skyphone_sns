const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");

// ユーザー登録
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (email.length > 50) {
      return res
        .status(400)
        .json({ message: "Email must be less than 50 characters" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json(newUser);
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ログイン
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received with data:", req.body);

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    console.log("Found user:", user);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: "パスワードが違います" });
    }

    console.log("Login successful for user:", email);
    return res.status(200).json(user);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
