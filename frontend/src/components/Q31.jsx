import "../assets/style/q.css"
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Q31 = () => {
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const correctAnswer = "Captain America"; 
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
          navigate("/q32"); 
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
                <h2>Problem 1</h2>
                <p>Welcome to the final round of Data Quest !! if you really reached
this far then you are really a data science prodigy…. avengers in Earth are sad
and hopeless as they couldnt save the earth from the snap…. and suddenly
they got a message from space… find out who is this..</p>
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

export default Q31;