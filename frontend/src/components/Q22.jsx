import "../assets/style/q.css"
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Q22 = () => {
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const correctAnswer = "Captain America"; 
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
          navigate("/q23"); 
        } else {
          setError("Wrong answer! Try again.");
        }
      };
    return(
        <div className="q">
<Navbar />
                <div id="grid">
        <div id="flex">
            <h1 id="title">ROUND 2</h1>
            <div id="question">
                <h2>Problem 2</h2>
                <p>Soul stone sacrificial: you have arrived to vormir to obtain the soul
stone from red skull. you are given a dataset containing items and the priority
score you have to sacrifice the high value one and then resultant which give
you a secret code by doing some aggregate function and decode it, tell it to
red skull
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

export default Q22;