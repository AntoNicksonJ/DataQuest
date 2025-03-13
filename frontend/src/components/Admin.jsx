import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../assets/style/admin.css";

const API_BASE_URL = "http://localhost:5000"; // Adjust according to your backend

const AdminDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [progress, setProgress] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [activeRound, setActiveRound] = useState(null);

    // Fetch teams from backend
    const fetchTeams = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            setTeams(response.data);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    // Fetch progress from backend
    const fetchProgress = async (roundNumber) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/progress-tracking/${roundNumber}`);
            setProgress(response.data.data);
        } catch (error) {
            console.error("Error fetching progress:", error);
        }
    };

    // Fetch leaderboard from backend
    const fetchLeaderboard = async (roundNumber) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leaderboard/${roundNumber}`);
            setLeaderboard(response.data.leaderboard);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    // Fetch current round status
    const fetchRoundStatus = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/round-status`);
            setActiveRound(response.data.active_round);
        } catch (error) {
            console.error("Error fetching round status:", error);
        }
    };

    // Start a round
    const startRound = async (roundId) => {
        try {
            await axios.post(`${API_BASE_URL}/rounds/start-round/${roundId}`);
            setActiveRound(roundId);
            fetchProgress(roundId);
            fetchLeaderboard(roundId);
        } catch (error) {
            console.error("Error starting round:", error);
        }
    };

    // End the round
    const endRound = async () => {
        try {
            await axios.post(`${API_BASE_URL}/rounds/end-round`);
            setActiveRound(null);
        } catch (error) {
            console.error("Error ending round:", error);
        }
    };

    useEffect(() => {
        fetchTeams();
        fetchRoundStatus();
    }, []);

    return (
        <div className="admin">
            <Navbar />
            <h1>Admin Dashboard</h1>

            {/* Team Management */}
            <section className="admin-team-management">
                <h2>Team Management</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Team Name</th>
                            <th>Email</th>
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => (
                            <tr key={team._id}>
                                <td>{team._id}</td>
                                <td>{team.name}</td>
                                <td>{team.email}</td>
                                <td>{team.password}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Progress Tracking */}
            <section className="admin-progress-tracking">
                <h2>Progress Tracking</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>Q1</th><th>Q2</th><th>Q3</th>
                            <th>Time Taken</th>
                            <th>Q4</th><th>Q5</th><th>Q6</th>
                            <th>Time Taken</th>
                            <th>Q7</th><th>Q8</th>
                            <th>Time Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {progress.map((teamProgress, index) => (
                            <tr key={index}>
                                <td>{teamProgress.team_name}</td>
                                {[...Array(8)].map((_, i) => (
                                    <td key={`q${i + 1}`}>{teamProgress[`Q${i + 1}`] || "❌"}</td>
                                ))}
                                <td>{teamProgress["Q1_time"] || "--"}</td>
                                <td>{teamProgress["Q4_time"] || "--"}</td>
                                <td>{teamProgress["Q7_time"] || "--"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Leaderboard */}
            <section className="admin-leaderboard">
                <h2>Leaderboard</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Team</th>
                            <th>Correct Answers</th>
                            <th>Total Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((team, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{team.team_name}</td>
                                <td>{team.correct_answers}</td>
                                <td>{`${Math.floor(team.total_time / 60)}:${String(team.total_time % 60).padStart(2, "0")}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Level Control */}
            <section className="admin-level-control">
                <h2>Level Control</h2>
                <div className="admin-round-control">
                    <h3>Current Active Round: {activeRound ? `Round ${activeRound}` : "None"}</h3>
                    <button
                        className={activeRound ? "admin-disable" : "admin-enable"}
                        onClick={() => activeRound ? endRound() : startRound(1)}
                    >
                        {activeRound ? "End Current Round" : "Start Round 1"}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
