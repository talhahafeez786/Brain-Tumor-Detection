import tensorflow as tf
import numpy as np
from PIL import Image
import io
import logging
import os
from src.brain_tumor.config.setting import get_settings

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

settings = get_settings()

class ModelService:
    def __init__(self):
        self.model = None
        self.model_path = settings.MODEL_PATH
        self.class_dict_path = settings.CLASSES_PATH
        self.image_size = (224, 224)  # Standard size for most CNN models
        # Default classes as fallback
        self.classes = {
            0: "glioma",
            1: "meningioma",
            2: "notumor",
            3: "pituitary"
        }
        self.accuracy = 98.00  # Approximate model accuracy
        
    async def load_model(self):
        """Load the model and class dictionary if not already loaded."""
        if self.model is None:
            try:
                logger.debug(f"Loading model from {self.model_path}")
                self.model = tf.keras.models.load_model(self.model_path)
                logger.debug("Model loaded successfully")
                
                # Load class dictionary
                try:
                    if os.path.exists(self.class_dict_path):
                        loaded_classes = np.load(self.class_dict_path, allow_pickle=True).item()
                        # Verify the loaded classes are valid
                        if isinstance(loaded_classes, dict) and loaded_classes:
                            self.classes = loaded_classes
                            logger.debug(f"Loaded classes: {self.classes}")
                        else:
                            logger.warning(f"Invalid class dict format, using default classes")
                    else:
                        logger.warning(f"Class dict not found at {self.class_dict_path}, using default classes")
                except Exception as e:
                    logger.warning(f"Error loading class dict: {e}, using default classes")
                
                # Print model summary to verify its structure
                self.model.summary(print_fn=logger.debug)
            except Exception as e:
                logger.error(f"Error loading model: {e}")
                raise RuntimeError(f"Failed to load model from {self.model_path}: {str(e)}")
        return self.model
    
    def get_tumor_info(self, class_name):
        """Return information about the tumor type."""
        tumor_info = {
            "glioma": "A tumor that originates from glial cells in the brain or spine.",
            "meningioma": "A tumor that forms on membranes covering the brain and spinal cord.",
            "notumor": "No evidence of tumor detected in the brain scan.",
            "pituitary": "A growth in the pituitary gland, which may affect hormone levels."
        }
        return tumor_info.get(class_name, "Unknown tumor type.")
    
    def get_class_name(self, class_index):
        """Safely get class name from index with fallback."""
        # Check if class_index exists in the classes dictionary
        if isinstance(self.classes, dict) and class_index in self.classes:
            return self.classes[class_index]
        
        # Handle list-type classes (if that's how they're stored)
        elif isinstance(self.classes, (list, tuple)) and 0 <= class_index < len(self.classes):
            return self.classes[class_index]
        
        # Default mapping as fallback
        default_classes = {
            0: "glioma", 
            1: "meningioma", 
            2: "notumor", 
            3: "pituitary"
        }
        
        if class_index in default_classes:
            logger.warning(f"Using default class name for index {class_index}")
            return default_classes[class_index]
        
        # Last resort
        logger.error(f"Unknown class index: {class_index}")
        return f"unknown_class_{class_index}"
    
    async def predict_image(self, image_bytes):
        """Predict the class of an image from bytes with detailed results."""
        # Load the model if not loaded
        model = await self.load_model()
        
        try:
            # Open and preprocess the image
            logger.debug("Opening image from bytes")
            image = Image.open(io.BytesIO(image_bytes))
            image = image.convert("RGB")  # Ensure it's RGB
            logger.debug(f"Original image size: {image.size}")
            
            # Resize the image
            image = image.resize(self.image_size)
            logger.debug(f"Resized image to: {image.size}")
            
            # Convert to array and normalize
            img_array = tf.keras.preprocessing.image.img_to_array(image)
            logger.debug(f"Image array shape: {img_array.shape}")
            
            img_array = np.expand_dims(img_array, axis=0)
            logger.debug(f"Expanded array shape: {img_array.shape}")
            
            img_array = img_array / 255.0
            
            # Make prediction
            logger.debug("Making prediction")
            predictions = model.predict(img_array)
            logger.debug(f"Raw prediction: {predictions}")
            logger.debug(f"Prediction shape: {predictions.shape}")
            
            # If prediction is empty or unexpected format, raise error
            if predictions.size == 0:
                raise ValueError("Model returned empty prediction array")
            
            # Process prediction and create detailed report
            if len(predictions) > 0 and len(predictions[0]) > 0:
                class_index = int(np.argmax(predictions[0]))
                class_name = self.get_class_name(class_index)
                confidence = float(predictions[0][class_index])
                
                logger.debug(f"Class index: {class_index}, Class: {class_name}")
                logger.debug(f"Confidence: {confidence}")
                
                # Create probabilities dictionary
                probabilities = {}
                for i in range(len(predictions[0])):
                    class_key = self.get_class_name(i)
                    probabilities[class_key] = float(predictions[0][i])
                
                # Determine diagnosis
                has_tumor = class_name != "notumor"
                diagnosis = "Brain tumor detected." if has_tumor else "No tumor detected."
                
                # Create detailed result
                result = {
                    "prediction": class_name,
                    "confidence": confidence,
                    "model_accuracy": self.accuracy,
                    "diagnosis": diagnosis,
                    "tumor_type": class_name.capitalize() + " Tumor" if has_tumor else "N/A",
                    "tumor_info": self.get_tumor_info(class_name),
                    "class_probabilities": probabilities
                }
                
                return result
            else:
                # Detailed error for debugging
                logger.error(f"Prediction array has unexpected structure: {predictions}")
                raise ValueError(f"Model returned unexpected prediction format. Shape: {predictions.shape}")
                
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise RuntimeError(f"Error processing image: {str(e)}")