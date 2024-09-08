from PIL import Image
import tensorflow as tf
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import logging

# Define the FastAPI app
app = FastAPI()

# Load the model (assuming the model is already loaded outside the function for efficiency)
model = tf.keras.models.load_model("tea_VGG16_model.h5")

# Define class labels
class_labels = pd.read_csv("tea diseases.csv")["folder_name"].tolist()  # Assuming "folder_name" holds class labels


def preprocess_image(image: UploadFile, target_size=(224, 224)):
  """Preprocesses an image for EfficientNetB3 input."""

  img = Image.open(image.file)  # Open image from uploaded file
  img = img.convert("RGB")  # Ensure RGB format
  resized = img.resize(target_size)

  # EfficientNetB3 preprocessing is included in the model itself
  normalized = np.array(resized) / 255.0  # Normalize pixel values to [0, 1]

  # No need to call a separate preprocessing function from TensorFlow
  # EfficientNetB3 models handle normalization internally during forward pass

  normalized = np.expand_dims(normalized, axis=0)  # Add batch dimension

  return normalized


@app.post("/predict_tea_disease")
async def predict_disease(image: UploadFile = File(...)):
  """Predicts tea disease from an uploaded image."""

  # Preprocess the image
  preprocessed_image = preprocess_image(image)

  # Make the prediction
  predictions = model.predict(preprocessed_image)


  # Find the index of the maximum prediction value
  max_index = np.argmax(predictions)

  # Get the predicted class label and its confidence score
  predicted_class = class_labels[max_index]
  confidence_score = predictions[0][max_index]  # Assuming predictions is a 2D array

  # Return the prediction results
  return {
      "predicted_class": predicted_class,
      "confidence_score": confidence_score.item()  # Convert to scalar
  }

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["POST", "GET"],  # Explicitly allow POST method
    allow_headers=["*"],
)


@app.post("/predict_tea_disease")
async def predict_disease(image: UploadFile = File(...)):
    logger.info(f"Received {request.method} request for /predict_tea_disease")
    logger.info(f"Received image: {image.filename}")
    # ... rest of your function ...


@app.get("/test")
async def test():
    return {"message": "API is working"}