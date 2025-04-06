import ButtonGradient from "../assets/svg/ButtonGradient"
import Benefits from "../component/Benefits";
import Collaboration from "../component/Collaboration";
import Footer from "../component/Footer";
import Header from "../component/Header";
import Hero from "../component/Hero";
import Pricing from "../component/Pricing";
import Roadmap from "../component/Roadmap";
import Services from "../component/Services";  
import FileUpload from "../component/FileUplaod";
import PredictionResult from "../component/PredictionResult"
import { BrowserRouter as Route, Routes, Router} from "react-router-dom";
const Home = () => {
  return (
    
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Services />
        <Pricing />
        <Footer />
      </div>
    
      <ButtonGradient />
    </>
  );
};

export default Home;
