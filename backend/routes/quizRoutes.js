const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const RoundStatus = require("../models/roundStatus"); // Import round status schema

// 📌 Correct Answers for Questions
const correctAnswers = {
  q11: "captain america",
  q12: "hulk",
  q13: "tony stark",
  q21: "black widow",
  q22: "thor",
  q23: "hawkeye",
  q31: "loki",
};

// 📌 Schema for storing team responses
const TeamResponseSchema = new mongoose.Schema({
  team_name: { type: String, required: true },
  round_number: { type: Number, required: true },
  responses: [
    {
      question_id: String,
      time_spent: String, // Time taken to answer (MM:ss)
    },
  ],
});

const TeamResponse = mongoose.model("TeamResponse", TeamResponseSchema);

// Helper function to calculate time difference (MM:ss)
const calculateTimeSpent = (startTime, submitTime) => {
  const [startH, startM, startS] = startTime.split(":").map(Number);
  const [submitH, submitM, submitS] = submitTime.split(":").map(Number);

  const startSeconds = startH * 3600 + startM * 60 + startS;
  const submitSeconds = submitH * 3600 + submitM * 60 + submitS;
  const totalSeconds = submitSeconds - startSeconds;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

// 📌 1️⃣ API to Submit Answer (Uses RoundStatus for Start Time)
router.post("/submit-answer", async (req, res) => {
  const { team_name, question_id, submission_time, answer } = req.body;

  try {
    // 🔍 Fetch active round's start time
    const roundStatus = await RoundStatus.findOne({});
    if (!roundStatus || !roundStatus.active_round) {
      return res
        .status(400)
        .json({ success: false, message: "No active round found!" });
    }

    const round_number = roundStatus.active_round;
    const round_start_time = roundStatus.started_at;

    // ⏳ Calculate time spent
    const time_spent = calculateTimeSpent(round_start_time, submission_time);

    // ✅ Check if the answer is correct
    if (
      !correctAnswers[question_id] ||
      correctAnswers[question_id].toLowerCase() !== answer.toLowerCase()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect answer. Try again!" });
    }

    // 📝 Find or create team response entry
    let teamResponse = await TeamResponse.findOne({ team_name, round_number });

    if (!teamResponse) {
      teamResponse = new TeamResponse({
        team_name,
        round_number,
        responses: [],
      });
    }

    // 🔄 **Check if question already exists in responses**
    const existingResponseIndex = teamResponse.responses.findIndex(
      (r) => r.question_id === question_id
    );

    if (existingResponseIndex !== -1) {
      // 🔄 **Update the existing response**
      teamResponse.responses[existingResponseIndex].time_spent = time_spent;
    } else {
      // ➕ **Add a new response**
      teamResponse.responses.push({ question_id, time_spent });
    }

    // 💾 Save the updated document
    await teamResponse.save();

    res.json({
      success: true,
      message: "Correct answer! Response saved.",
      time_spent,
    });
  } catch (err) {
    console.error("Error saving response:", err);
    res.status(500).json({ success: false, message: "Error saving response" });
  }
});

module.exports = router;
