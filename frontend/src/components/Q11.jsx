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
                const response = await axios.get("http://localhost:5000/users/session");
                setTeamName(response.data.teamname);
            } catch (err) {
                console.error("Error fetching team name:", err);
                setError("Could not fetch team name. Try refreshing.");
            }
        };

        fetchTeamName();
    }, []);

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
            console.log("Submitting:", { team_name: teamName, question_id: "q11", submission_time: submissionTime, answer });

            const response = await axios.post("http://localhost:5000/quiz/submit-answer", {
                team_name: teamName,
                question_id: "q11",
                submission_time: submissionTime,
                answer, // Sending the user's answer
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                navigate("/q12");
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
