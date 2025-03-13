import "../assets/style/q.css"
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Q23 = () => {
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
            <h1 id="title">ROUND 2</h1>
            <div id="question">
                <h2>Problem 3</h2>
                <p>Avengers are fighting in teams against Thanos in various location
like in titan iron man and his team is fighting and in earth captain America is
leading a team along with black panther. In the given datas location column
specifies the place of fight, heroes fighting there and there power there. Now
find who are top 3 important persons in each location by grouping it 
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

export default Q23;

