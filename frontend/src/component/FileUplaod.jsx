import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "./Button";
import axios from "axios";


const API_URL = 'http://localhost:8000';
const FileUpload = ({ onPredictions }) => {
  const [images, setImages] = useState([]);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setImages((prev) => [...prev, ...newImages]);
    },
  });



const handlePredict = async () => {
  if (!images || images.length === 0) {
    console.error("No image selected.");
    return;
  }

  const formData = new FormData();
  formData.append("file", images[0]); // Backend expects one file with key 'file'

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
  }
};
  
  return (
    <div className="w-full md:w-1/2">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-600 p-16 rounded-lg text-center bg-gray-800 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-gray-400">Drag & Drop Image(s) here</p>
        <p className="text-blue-400 underline">or Browse Image</p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {images.map((img, index) => (
          <div key={index} className="border border-gray-600 rounded-lg p-1">
            <img
              src={img.preview}
              alt={img.name}
              className="w-full h-20 object-cover rounded"
            />
          </div>
        ))}
      </div>

      <Button
        onClick={handlePredict}
        className="mt-4 py-2 px-6 rounded-lg w-full"
      >
        PREDICT
      </Button> 
    </div>
  );
};

export default FileUpload;
