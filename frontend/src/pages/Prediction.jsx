import React, { useState } from "react";
import PredictionResult from "../component/PredictionResult";
import FileUpload from "../component/FileUplaod";
import ButtonGradient from "../assets/svg/ButtonGradient";
import Header from "../component/Header";
import Services from "../component/Services";
import Section from "../component/Section";

const Prediction = () => {
  const [predictions, setPredictions] = useState([]);


  const onPredictions = (data) => {
    // Since the backend sends a single object, we wrap it into an array
    const formattedPrediction = {
      _id: data._id,
      prediction: data.prediction, // tumor type or "notumor"
      confidence: data.confidence, // Confidence as a decimal
      model_accuracy: data.model_accuracy, // Model accuracy percentage
      diagnosis: data.diagnosis, // Diagnosis message
      tumor_type: data.tumor_type, // Type of tumor if present
      tumor_info: data.tumor_info, // Information about the tumor
      class_probabilities: data.class_probabilities, // Probabilities for each class
      image_name: data.image_name, // Optional, if available
      prediction_date: data.prediction_date // Optional, if available
    };
    
    // Set predictions to an array containing the single prediction object
    setPredictions([formattedPrediction]);

  };

  
  return (
    <>
      <Header />
      <ButtonGradient />
      <Section id="#prediction">
        <div className="container flex flex-col md:flex-row gap-6 p-6 min-h-screen mt-20">
          <FileUpload onPredictions={onPredictions} />
          <PredictionResult predictions={predictions} />
        </div>
      </Section>
    </>
  );
};

export default Prediction;
