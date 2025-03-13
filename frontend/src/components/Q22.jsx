import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/ironman.jpg";

const Q22 = () => {
  const [answer, setAnswer] = useState("");
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch team name on component mount
  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await axios.get(
          "http://192.168.23.5:5000/users/session"
        );
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
      console.log("Submitting:", {
        team_name: teamName,
        question_id: "q22",
        submission_time: submissionTime,
        answer,
      });

      const response = await axios.post(
        "http://192.168.23.5:5000/quiz/submit-answer",
        {
          team_name: teamName,
          question_id: "q22",
          submission_time: submissionTime,
          answer,
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        navigate("/q23"); // Navigate to next question if correct
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

  // Check if round is still active (Polling every 5 seconds)
  useEffect(() => {
    if (!teamName) return;

    let isMounted = true; // Track component mount state

    const validateAccess = async () => {
      try {
        // Fetch round status
        const roundResponse = await axios.get(
          "http://192.168.23.5:5000/rounds/round-status"
        );
        const { active_round } = roundResponse.data;

        if (!active_round && isMounted) {
          console.log("Round inactive. Redirecting...");
          navigate("/level", { replace: true });
          return;
        }

        // Fetch team responses
        const response = await fetch(
          "http://192.168.23.5:5000/rounds/team-response",
          {
            credentials: "include",
          }
        );
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

  return (
    <div className="q" style={{ backgroundImage: `url(${bg})` }}>
      <Navbar />
      <div id="grid">
        <div id="flex">
          <h1 id="title">ROUND 2</h1>
          <div id="question">
            <h2>Problem 2</h2>
            <p>
              Soul stone sacrificial: you have arrived at Vormir to obtain the
              soul stone from Red Skull. You are given a dataset containing
              items and the priority score. You have to sacrifice the highest
              value one, then compute a secret code using an aggregate function,
              and decode it to tell Red Skull.
            </p>
            <h3>
              Data: <a href="#">click here</a>
            </h3>
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

export default Q22;
