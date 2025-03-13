import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const Q13 = () => {
    const [answer, setAnswer] = useState("");
    const [teamName, setTeamName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString("en-GB", { hour12: false });
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
            console.log("Submitting:", { team_name: teamName, question_id: "q13", submission_time: submissionTime, answer });

            const response = await axios.post("http://localhost:5000/quiz/submit-answer", {
                team_name: teamName,
                question_id: "q13",
                submission_time: submissionTime,
                answer,
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                toast.success("Round completed! 🎉", { autoClose: 5000 }); // Show success message
                setTimeout(() => {
                    navigate("/level"); // Redirect after 2 seconds
                }, 5000);
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
            <ToastContainer /> {/* Required for notifications */}
            <div id="grid">
                <div id="flex">
                    <h1 id="title">ROUND 1</h1>
                    <div id="question">
                        <h2>Problem 3</h2>
                        <p>
                            Find the trajectory path and inform Iron Man. We are at the end of the fight 
                            in New York City. A missile has been released to destroy the city, and Iron Man 
                            must divert it into the portal. However, a building is directly in front of him.
                            He must pass through a certain point to avoid or just touch one point of the building.
                            (Iron Man is following an exponential path; find the correct function for the trajectory.)
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

export default Q13;
