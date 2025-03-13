import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Q23 = () => {
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
            console.log("Submitting:", { team_name: teamName, question_id: "q23", submission_time: submissionTime, answer });

            const response = await axios.post("http://localhost:5000/quiz/submit-answer", {
                team_name: teamName,
                question_id: "q23",
                submission_time: submissionTime,
                answer,
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                navigate("/level"); // Navigate to next level if correct
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
        <div className="q">
            <Navbar />
            <div id="grid">
                <div id="flex">
                    <h1 id="title">ROUND 2</h1>
                    <div id="question">
                        <h2>Problem 3</h2>
                        <p>
                            Avengers are fighting in teams against Thanos in various locations.
                            On Titan, Iron Man and his team are fighting, while on Earth, Captain America
                            is leading a team with Black Panther. The given dataset contains a location
                            column that specifies the place of the fight, the heroes fighting there, and their
                            power levels. Now, find the top 3 most important persons in each location
                            by grouping the data.
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

export default Q23;
