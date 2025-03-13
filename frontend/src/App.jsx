import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Level from "./components/Level";
import Admin from "./components/Admin";
import Q11 from "./components/Q11";
import Q12 from "./components/Q12";
import Q13 from "./components/Q13";
import Q21 from "./components/Q21";
import Q22 from "./components/Q22";
import Q23 from "./components/Q23";
import Q31 from "./components/Q31";
import Login from "./components/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/level" element={<Level />} />
      <Route path="/login" element={<Login />} />
      <Route path="/q11" element={<Q11 />} />
      <Route path="/q12" element={<Q12 />} />
      <Route path="/q13" element={<Q13 />} />
      <Route path="/q21" element={<Q21 />} />
      <Route path="/q22" element={<Q22 />} />
      <Route path="/q23" element={<Q23 />} />
      <Route path="/q31" element={<Q31 />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
