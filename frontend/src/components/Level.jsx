import "../assets/style/level.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

function Level() {
  const [teamName, setTeamName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamName();
  }, []);

  const fetchTeamName = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/session", {
        withCredentials: true,
      });
      console.log("Session Active:", response.data);
      setTeamName(response.data.teamname);
    } catch (error) {
      console.error("Session Check Failed:", error.response?.data || error);
      setTeamName(null);
      navigate("/"); // 🔄 Redirect to login if session is missing
    }
  };

  return (
    <div className="level">
      <Navbar /> {/* ✅ Navbar added here */}
      <h1 id="title">
        <span id="blue">Data</span> <span id="red">Quest</span>
      </h1>
      <div id="flex">
        <div className="rounds">
          Round 1
          <Link to="/q11">
            <button className="start"> Start </button>
          </Link>
        </div>
        <div className="rounds">
          Round 2
          <Link to="/q21">
            {" "}
            <button className="start"> Start </button>
          </Link>
        </div>
        <div className="rounds">
          Round 3
          <Link to="/q31">
            <button className="start"> Start </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Level;
