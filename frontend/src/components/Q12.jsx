import "../assets/style/q.css"
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Q12 = () => {
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const correctAnswer = "Captain America"; 
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
          navigate("/q13"); 
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
                <h2>Problem 2</h2>
                <p>Great work buddies, Lets move to help other, our Green monster(hulk) and Thor is in middle of enemies army and approaching them from both the sides, Hulk decided to attack the side which has maximum power. Which side should he attack ?
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

export default Q12;