import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import bg from "../assets/spider.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Q13 = () => {
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
                toast.error("Could not fetch team name. Try refreshing.");
            }
        };

        fetchTeamName();
    }, []);

    // Check if round is still active and poll every 5 seconds
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
            toast.error("Team name is missing. Please try logging in again.");
            setLoading(false);
            return;
        }

        if (!answer.trim()) {
            toast.error("Please enter an answer.");
            setLoading(false);
            return;
        }

        try {
            console.log("Submitting:", { team_name: teamName, question_id: "q13", submission_time: new Date().toISOString(), answer });

            const response = await axios.post("http://192.168.23.5:5000/quiz/submit-answer", {
                team_name: teamName,
                question_id: "q13",
                submission_time: new Date().toISOString(),
                answer,
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                toast.success("Successfully submitted! Redirecting...");
                setTimeout(() => navigate("/level", { replace: true }), 2000); // Redirect after 2 seconds
            } else {
                toast.error("Wrong answer! Try again.");
            }
        } catch (err) {
            console.error("Error submitting answer:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="q" style={{ backgroundImage: `url(${bg})` }}>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
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
                </div>
            </div>
        </div>
    );
};

export default Q13;
