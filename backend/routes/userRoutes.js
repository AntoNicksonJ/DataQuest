const express = require("express");
const session = require("express-session");
const User = require("../models/users"); // Ensure correct path
const mongoose = require("mongoose");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { teamname, email, password } = req.body;

  try {
    // Check if teamname already exists
    const existingUser = await User.findOne({ teamname });
    if (existingUser) {
      return res.status(400).json({ error: "Team name already exists" });
    }

    // Create a new user
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

    // Store user session with teamname and session ID
    req.session.teamname = user.teamname;
    console.log(
      `Session created: ${req.sessionID} for team ${req.session.teamname}`
    );

    res.json({
      message: "Login successful",
      sessionID: req.sessionID,
      teamname: user.teamname,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  console.log('Logging out...');
  if (!req.session) {
      return res.status(400).json({ success: false, error: "No active session" });
  }

  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ success: false, error: "Logout failed" });
      }

      // ✅ Explicitly clear session cookie
      res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: false // Set `true` if using HTTPS
      });

      console.log("✅ Session destroyed and cookie cleared");
      res.json({ success: true, message: "Logout successful" });
  });
});

// Get Session Info (For Debugging)
router.get("/session", (req, res) => {
  if (req.session.teamname) {
    res.json({ message: "Session active", teamname: req.session.teamname });
  } else {
    res.status(401).json({ error: "No active session" });
  }
});

module.exports = router;
