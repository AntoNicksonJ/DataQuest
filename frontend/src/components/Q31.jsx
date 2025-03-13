import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from '../assets/thanos.jpg'

const Q31 = () => {
    const [answer, setAnswer] = useState("");
    const [teamName, setTeamName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch team name on component mount
    useEffect(() => {
        const fetchTeamName = async () => {
            try {
                const response = await axios.get("http://192.168.23.5:5000/users/session");
                setTeamName(response.data.teamname);
            } catch (err) {
                console.error("Error fetching team name:", err);
                setError("Could not fetch team name. Try refreshing.");
            }
        };

        fetchTeamName();
    }, []);

    useEffect(() => {
        const checkRoundStatus = async () => {
            try {
                const response = await axios.get("http://192.168.23.5:5000/rounds/round-status");
                const { active_round } = response.data;

                if (!active_round || active_round !== 3) {
                    navigate("/level"); // Redirect if round has ended
                }
            } catch (error) {
                console.error("Error fetching round status:", error);
            }
        };

        checkRoundStatus();
        const interval = setInterval(checkRoundStatus, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [navigate]);

    // Helper function to get current time (HH:mm:ss)
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString("en-GB", { hour12: false }); // 24-hour format
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!teamName) {
            setError("Team name is missing. Please try logging in again.");
            setLoading(false);
            return;
        }

        if (!answer.trim()) {
            setError("Please enter an answer.");
            setLoading(false);
            return;
        }

        try {
            const submissionTime = getCurrentTime();
            console.log("Submitting:", { team_name: teamName, question_id: "q31", submission_time: submissionTime, answer });

            const response = await axios.post("http://192.168.23.5:5000/quiz/submit-answer", {
                team_name: teamName,
                question_id: "q31",
                submission_time: submissionTime,
                answer,
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                navigate("/level"); // Navigating to the final level
            } else {
                setError("Wrong answer! Try again.");
            }
        } catch (err) {
            console.error("Error submitting answer:", err);
            if (err.response) {
                console.error("Server response:", err.response.data);
                setError(`Error: ${err.response.data.message}`);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="q" style={{ backgroundImage: `url(${bg})` }}>
            <Navbar />
            <div id="grid">
                <div id="flex">
                    <h1 id="title">ROUND 3</h1>
                    <div id="question">
                        <h2>Problem 1</h2>
                        <p>
                            Welcome to the final round of Data Quest! If you've made it this far, you're truly a data science prodigy.
                            The Avengers on Earth are feeling hopeless after failing to stop the snap... but suddenly,
                            they receive a mysterious message from space. Find out who sent it.
                        </p>
                        <h3>Data: <a href="#">click here</a></h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            value={answer} 
                            id="answer" 
                            placeholder="Type your answer" 
                            onChange={(e) => setAnswer(e.target.value)} 
                            required 
                        />
                        <button type="submit" id="submit" disabled={loading}>
                            {loading ? "Checking..." : "Submit"}
                        </button>
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Q31;
