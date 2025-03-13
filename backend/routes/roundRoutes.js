const express = require("express");
const router = express.Router();
const RoundStatus = require("../models/roundStatus"); // Import schema

// Helper function to get current time in HH:mm:ss format
const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour12: false }); // 24-hour format
};

// Helper function to calculate time after 3 hours
const getEndTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 3);
    return now.toLocaleTimeString("en-GB", { hour12: false });
};

// 📌 1️⃣ Start a Round (Automatically Ends in 3 Hours, Creates Schema if Not Exists)
router.post("/start-round/:round", async (req, res) => {
    const { round } = req.params;

    try {
        const startTime = getCurrentTime();
        const endTime = getEndTime();

        let roundStatus = await RoundStatus.findOne({});

        if (!roundStatus) {
            // Create schema if it doesn't exist
            roundStatus = new RoundStatus({
                active_round: round,
                started_at: startTime,
                ended_at: endTime,
            });
        } else {
            // Update existing schema
            roundStatus.active_round = round;
            roundStatus.started_at = startTime;
            roundStatus.ended_at = endTime;
        }

        await roundStatus.save();

        res.json({ success: true, message: `Round ${round} started at ${startTime}, will end at ${endTime}` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error starting round" });
    }
});

// 📌 2️⃣ Manually End the Round
router.post("/end-round", async (req, res) => {
    try {
        const roundStatus = await RoundStatus.findOne({});
        if (!roundStatus || !roundStatus.active_round) {
            return res.status(400).json({ success: false, message: "No active round to end" });
        }

        roundStatus.active_round = null;
        await roundStatus.save();

        res.json({ success: true, message: `Round manually ended.` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error ending round" });
    }
});

// 📌 3️⃣ Auto-End Round (Runs Every Minute)
const checkAndEndRound = async () => {
    const roundStatus = await RoundStatus.findOne({});
    if (!roundStatus || !roundStatus.active_round) return;

    const currentTime = getCurrentTime();
    if (currentTime >= roundStatus.ended_at) {
        roundStatus.active_round = null;
        await roundStatus.save();
        console.log(`Round automatically ended at ${currentTime}`);
    }
};

// Run auto-end check every minute
setInterval(checkAndEndRound, 60000);

// 📌 4️⃣ Fetch Current Active Round
router.get("/round-status", async (req, res) => {
    try {
        const roundStatus = await RoundStatus.findOne({});
        
        if (!roundStatus || !roundStatus.active_round) {
            return res.json({ active_round: null, started_at: null, ended_at: null });
        }

        res.json({
            active_round: roundStatus.active_round,
            started_at: roundStatus.started_at,
            ended_at: roundStatus.ended_at,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching round status" });
    }
});

module.exports = router;
