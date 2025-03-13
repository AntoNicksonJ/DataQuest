const express = require("express");
const session = require("express-session");
const User = require("../models/users"); // Ensure correct path
const mongoose = require("mongoose");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { teamname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ teamname });
    if (existingUser) {
      return res.status(400).json({ error: "Team name already exists" });
    }

    const user = new User({ teamname, email, password });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { teamname, password } = req.body;

  try {
    const user = await User.findOne({ teamname, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.teamname = user.teamname;
    console.log(`Session created: ${req.sessionID} for team ${req.session.teamname}`);

    res.json({ message: "Login successful", sessionID: req.sessionID, teamname: user.teamname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  console.log('Logging out...');
  if (!req.session) {
    return res.status(400).json({ success: false, error: "No active session" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Logout failed" });
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    console.log("✅ Session destroyed and cookie cleared");
    res.json({ success: true, message: "Logout successful" });
  });
});

// Get Active Session
router.get("/session", (req, res) => {
  if (req.session.teamname) {
    res.json({ message: "Session active", teamname: req.session.teamname });
  } else {
    res.status(401).json({ error: "No active session" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "teamname email password"); // Fetch only required fields
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

module.exports = router;
