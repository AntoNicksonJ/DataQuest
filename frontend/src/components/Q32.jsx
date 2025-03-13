import "../assets/style/q.css"
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Q32 = () => {
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
            <h1 id="title">ROUND 3</h1>
            <div id="question">
                <h2>Problem 2</h2>
                <p> NOW ! we are in Endgame , the last chance to win Thanos. we
somehow got all the heroes back. we have analyzed every other combinations
of heroes and their probability of wining against Thanos. using the given data
set train a ML model which can predict the given data . this would help them to
strategies better.
</p>
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

export default Q32;