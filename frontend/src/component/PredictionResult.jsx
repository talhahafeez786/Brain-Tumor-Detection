import React from "react";

const PredictionResult = ({ predictions }) => {
  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-xl font-semibold mb-6">Our Predictions</h2>
      <div className="mt-4 space-y-6">
        {predictions.length > 0 ? (
          predictions.map((prediction) => (
            <div
              key={prediction._id}
              className={`p-6 rounded-xl shadow-lg ${
                prediction.prediction !== "notumor" ? "bg-red-900/80" : "bg-green-900/80"
              }`}
            >
              <p
                className={`text-lg font-bold mb-3 ${
                  prediction.prediction !== "notumor" ? "text-red-300" : "text-green-300"
                }`}
              >
                {prediction.diagnosis}
              </p>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-200">
                  Prediction: <span className="capitalize font-medium ml-2">{prediction.prediction}</span>
                </p>
                <p className="text-sm text-gray-300">
                  Confidence: <span className="font-medium ml-2">{(prediction.confidence * 100).toFixed(2)}%</span>
                </p>
                <p className="text-sm text-gray-300">
                  Model Accuracy: <span className="font-medium ml-2">{prediction.model_accuracy}%</span>
                </p>
              </div>
              
              {prediction.prediction !== "notumor" && (
                <div className="mt-5 border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-200">
                    Tumor Type: <span className="font-medium ml-2">{prediction.tumor_type}</span>
                  </p>
                  <p className="text-sm text-gray-300 mt-3 leading-relaxed">{prediction.tumor_info}</p>
                </div>
              )}
              
              {/* Class Probabilities */}
              <div className="mt-6 border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-200 mb-3 font-medium">Class Probabilities:</p>
                <div className="space-y-3">
                  {prediction.class_probabilities && Object.entries(prediction.class_probabilities).map(([className, prob]) => (
                    <div key={className}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="capitalize text-gray-300">{className}:</span>
                        <span className="text-gray-300 font-medium">{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700/60 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            className === "notumor" ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${prob * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {prediction.prediction_date && (
                <p className="text-xs text-gray-400 mt-5 pt-3 border-t border-gray-700/50">
                  Date: {new Date(prediction.prediction_date).toLocaleString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 bg-gray-800/40 rounded-xl text-center">
            <p className="text-gray-400">No predictions available</p>
            <p className="text-sm text-gray-500 mt-2">Upload an MRI scan to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionResult;