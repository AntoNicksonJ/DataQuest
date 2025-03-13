const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Schema for storing team responses
const TeamResponseSchema = new mongoose.Schema({
    team_name: { type: String, required: true },
    round_number: { type: Number, required: true },
    responses: [
        {
            question_id: String,
            time_spent: String // Time taken to answer the question (MM:ss)
        }
    ]
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

// 📌 1️⃣ API to Submit Answer (Stores Time Spent)
router.post("/submit-answer", async (req, res) => {
    const { team_name, round_number, question_id, submission_time, round_start_time } = req.body;

    try {
        // Calculate time spent on this question
        const time_spent = calculateTimeSpent(round_start_time, submission_time);

        // Find or create the team response
        let teamResponse = await TeamResponse.findOne({ team_name, round_number });

        if (!teamResponse) {
            teamResponse = new TeamResponse({ team_name, round_number, responses: [] });
        }

        // Save the response
        teamResponse.responses.push({ question_id, time_spent });
        await teamResponse.save();

        res.json({ success: true, message: "Response saved successfully", time_spent });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error saving response" });
    }
});

module.exports = router;
