import React from "react";

const PredictionResult = ({ predictions }) => {
  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-xl font-semibold">Our Predictions</h2>
      <div className="mt-4 space-y-4">
        {predictions.length > 0 ? (
          predictions.map((prediction) => (
            <div
              key={prediction._id}
              className={`p-4 rounded-lg ${
                prediction.prediction !== "notumor" ? "bg-red-900" : "bg-green-900"
              }`}
            >
              <p
                className={`font-bold ${
                  prediction.prediction !== "notumor" ? "text-red-400" : "text-green-400"
                }`}
              >
                {prediction.diagnosis}
              </p>
              
              <div className="mt-2">
                <p className="text-sm text-gray-300">
                  Prediction: <span className="capitalize">{prediction.prediction}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Confidence: {(prediction.confidence * 100).toFixed(2)}%
                </p>
                <p className="text-sm text-gray-400">
                  Model Accuracy: {prediction.model_accuracy}%
                </p>
              </div>
              
              {prediction.prediction !== "notumor" && (
                <div className="mt-2 border-t border-gray-700 pt-2">
                  <p className="text-sm text-gray-300">Tumor Type: {prediction.tumor_type}</p>
                  <p className="text-sm text-gray-400 mt-1">{prediction.tumor_info}</p>
                </div>
              )}
              
              {/* Class Probabilities */}
              <div className="mt-3 border-t border-gray-700 pt-2">
                <p className="text-sm text-gray-300 mb-1">Class Probabilities:</p>
                {prediction.class_probabilities && Object.entries(prediction.class_probabilities).map(([className, prob]) => (
                  <div key={className} className="mt-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize text-gray-400">{className}:</span>
                      <span className="text-gray-400">{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-0.5">
                      <div 
                        className={`h-1.5 rounded-full ${className === "notumor" ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ width: `${prob * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {prediction.prediction_date && (
                <p className="text-xs text-gray-500 mt-3">
                  Date: {new Date(prediction.prediction_date).toLocaleString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No predictions available</p>
        )}
      </div>
    </div>
  );
};

export default PredictionResult;