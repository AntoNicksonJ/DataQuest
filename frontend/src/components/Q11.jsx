import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import bg from "../assets/ironman.jpg";

const Q11 = () => {
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

    // Check if round is still active
    useEffect(() => {
        const checkRoundStatus = async () => {
            try {
                const response = await axios.get("http://192.168.23.5:5000/rounds/round-status");
                const { active_round } = response.data;

                if (!active_round || active_round !== 1) {
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
            const response = await axios.post("http://192.168.23.5:5000/quiz/submit-answer", {
                team_name: teamName,
                question_id: "q11",
                submission_time: new Date().toISOString(),
                answer,
            });

            if (response.data.success) {
                setTimeout(() => navigate("/q12"), 1000);
            } else {
                setError("Wrong answer! Try again.");
            }
        } catch (err) {
            console.error("Error submitting answer:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="q" style={{ backgroundImage: `url(${bg})` }}>
            <Navbar />
            <div id="grid">
                <div id="flex">
                    <h1 id="title">ROUND 1</h1>
                    <div id="question">
                        <h2>Problem 1</h2>
                        <p>Welcome to Data Quest! Decode the clue and find out who's coming to help us!</p>
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

export default Q11;