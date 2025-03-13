import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/captain.jpg";

const Q12 = () => {
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

    // Check if round is still active (Polling every 5 seconds)
    useEffect(() => {
        if (!teamName) return;

        let isMounted = true; // Track component mount state

        const validateAccess = async () => {
            try {
                // Fetch round status
                const roundResponse = await axios.get("http://192.168.23.5:5000/rounds/round-status");
                const { active_round } = roundResponse.data;

                if (!active_round && isMounted) {
                    console.log("Round inactive. Redirecting...");
                    navigate("/level", { replace: true });
                    return;
                }

                // Fetch team responses
                const response = await fetch("http://192.168.23.5:5000/rounds/team-response", {
                    credentials: "include",
                });
                const data = await response.json();

                if (!data.teamReponses?.responses[0] && isMounted) {
                    console.log("Q11 not completed. Redirecting...");
                    navigate("/q11", { replace: true });
                }
            } catch (error) {
                console.error("Error validating access:", error);
            }
        };

        // Run validation immediately and then every 5 seconds
        validateAccess();
        const intervalId = setInterval(validateAccess, 5000);

        return () => {
            clearInterval(intervalId); // Cleanup interval on unmount
            isMounted = false;
        };
    }, [teamName, navigate]);

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
                question_id: "q12",
                submission_time: new Date().toISOString(),
                answer,
            });

            if (response.data.success) {
                navigate("/q13");
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
                        <h2>Problem 2</h2>
                        <p>
                            Great work buddies! Let's move to help others. Our Green monster (Hulk) and Thor
                            are in the middle of an enemy army, approaching them from both sides.
                            Hulk decided to attack the side with maximum power. Which side should he attack?
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

export default Q12;
