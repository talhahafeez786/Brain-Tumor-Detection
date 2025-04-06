import { Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home.jsx";
import Prediction from "./pages/Prediction.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prediction" element={<Prediction />} />
    </Routes>
  );
};

export default App;