import "../assets/style/q.css"
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Q13 = () => {
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const correctAnswer = "Captain America"; 
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
          navigate("/level"); 
        } else {
          setError("Wrong answer! Try again.");
        }
      };

    return(
        <div className="q">
        <Navbar />
                <div id="grid">
        <div id="flex">
            <h1 id="title">ROUND 1</h1>
            <div id="question">
                <h2>Problem 3</h2>
                <p>Find the Trajectory path and Inform Iron Man. we are at the end of
the fight at New York city. Missile has been released to destroy New York city,
Iron man has to divert missile to the above opened portal. while diverting the
missile he is going to collide into a building in front of him. he has to go
through the certain point so that he goes avoids or just touch the one point in
the building. ( Iron man is following a Exponential path, you have to find the
correct function for trajectory path ) </p>
                <h3>Data: <a href="#">click here</a></h3>
            </div>
            <form onSubmit={handleSubmit}>
            <input type="text" value={answer} id="answer" placeholder="Type your answer" onChange={(e) => setAnswer(e.target.value)} required></input>
            <button type="submit" id="submit">Submit</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        </div>
        </div>
    )
}

export default Q13;