import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Button from "./Button";
import axios from "axios";

const API_URL = 'http://localhost:8000';

const FileUpload = ({ onPredictions }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // Take only the first image if multiple are uploaded
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
      setImage(fileWithPreview);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false, // Allow only one file
    onDrop
  });

  const handleRemoveImage = () => {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
  };

  const handlePredict = async () => {
    if (!image) {
      console.error("No image selected.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image); // Backend expects one file with key 'file'

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/predict/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onPredictions(response.data); // Send prediction result to parent
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Prediction error:",
          error.response?.data?.detail || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full md:w-1/2 bg-n-8/80 rounded-3xl p-4 md:p-6 flex flex-col min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4 text-white">Upload MRI Image</h2>
      
      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className="flex-1 flex flex-col items-center justify-center mb-6 border-2 border-dashed border-n-6 rounded-xl p-4 transition-colors hover:border-color-1 cursor-pointer"
      >
        <input {...getInputProps()} />
        
        {!image ? (
          <>
            <div className="text-center">
              <svg 
                className="w-12 h-12 text-n-6 mb-3 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-n-4 text-sm text-center">
                <span className="font-medium text-white">Drag & Drop Image here</span>
              </p>
              <p className="text-xs text-n-6 mt-1">or</p>
              <p className="text-n-4 text-sm font-medium text-white mt-1">
                Browse Image
              </p>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={image.preview} 
              alt="MRI Preview" 
              className="max-w-full max-h-[250px] rounded-lg object-contain" 
            />
          </div>
        )}
      </div>

      {/* Image Display Area */}
      {image && (
        <div className="mb-4 flex items-center justify-between bg-n-7 rounded-xl p-3">
          <div className="flex items-center">
            <div className="w-12 h-12 mr-3 rounded bg-n-6 overflow-hidden">
              <img 
                src={image.preview} 
                alt="Thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-white truncate max-w-[150px]">{image.name}</p>
              <p className="text-xs text-n-4">{(image.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
            className="text-red-500 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Predict Button */}
      <Button 
        onClick={handlePredict} 
        disabled={!image || loading}
        className="relative flex justify-center items-center h-[48px] px-6  rounded-lg transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ANALYZING...
          </>
        ) : (
          "PREDICT"
        )}
      </Button>
    </div>
  );
};

export default FileUpload;