from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import pandas as pd
from PIL import Image
import io

# Define the FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cropplus.vercel.app"],  # Replace with your Vercel app URL
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Load the model (assuming the model is already loaded outside the function for efficiency)
model = tf.keras.models.load_model("CropAPI/tea_VGG16_model.h5")

# Define class labels
class_labels = pd.read_csv("CropAPI/tea diseases.csv")["folder_name"].tolist()  # Assuming "folder_name" holds class labels


def preprocess_image(image_bytes, target_size=(224, 224)):
  """Preprocesses an image for EfficientNetB3 input."""

  img = Image.open(io.BytesIO(image_bytes))
  img = img.convert("RGB")
  resized = img.resize(target_size)

  # EfficientNetB3 preprocessing is included in the model itself
  normalized = np.array(resized) / 255.0  # Normalize pixel values to [0, 1]

  # No need to call a separate preprocessing function from TensorFlow
  # EfficientNetB3 models handle normalization internally during forward pass

  normalized = np.expand_dims(normalized, axis=0)  # Add batch dimension

  return normalized


@app.post("/api/predict_tea_disease")
async def predict_disease(image: UploadFile = File(...)):
  """Predicts tea disease from an uploaded image."""
  contents = await image.read()
  preprocessed_image = preprocess_image(contents)
  predictions = model.predict(preprocessed_image)

  # Find the index of the maximum prediction value
  max_index = np.argmax(predictions[0])

  # Get the predicted class label and its confidence score
  predicted_class = class_labels[max_index]
  confidence_score = float(np.max(predictions[0]))

  # Return the prediction results
  return {
      "predicted_class": predicted_class,
      "confidence_score": confidence_score
  }

@app.get("/api/test")
async def test():
    return {"message": "API is working"}

