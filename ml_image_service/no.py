from sagemaker.tensorflow.model import TensorFlowModel
import sagemaker
import time
import math
import numpy as np
import cv2
from cvzone.HandTrackingModule import HandDetector
# import tensorflow as tf
# Set up the SageMaker session and TensorFlow predictor
sagemaker_session = sagemaker.Session(
    default_bucket="sagemaker-data-s2t")
# inputs = sagemaker_session.upload_data(path=‘model_deploy.tar.gz’, key_prefix=‘model’)
predictor = sagemaker.tensorflow.model.TensorFlowPredictor(
    endpoint_name="tensorflow-inference-tf",
    sagemaker_session=sagemaker_session
)
# model = tf.keras.models.load_model(“Model/keras_model.h5”)
class_names = open("Model/labels.txt", "r").readlines()
detector = HandDetector(maxHands=1)
offset = 20
imgSize = 300


def getPrediction(file):
    image_data = file.read()
    image_array = np.frombuffer(image_data, dtype=np.uint8)
    img = cv2.imdecode(image_array, flags=cv2.IMREAD_COLOR)
    hands, img = detector.findHands(img)
    if hands:
        hand = hands[0]
        x, y, w, h = hand['bbox']
        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
        imgCrop = img[y - offset:y + h + offset, x - offset:x + w + offset]
        imgCropShape = imgCrop.shape
        aspectRatio = h / w
        if aspectRatio > 1:
            k = imgSize / h
            wCal = math.ceil(k * w)
            imgResize = cv2.resize(imgCrop, (wCal, imgSize))
            imgResizeShape = imgResize.shape
            wGap = math.ceil((imgSize - wCal) / 2)
            imgWhite[:, wGap:wCal + wGap] = imgResize
        else:
            k = imgSize / w
            hCal = math.ceil(k * h)
            imgResize = cv2.resize(imgCrop, (imgSize, hCal))
            imgResizeShape = imgResize.shape
            hGap = math.ceil((imgSize - hCal) / 2)
            imgWhite[hGap:hCal + hGap, :] = imgResize
        # Resize the image to the input size of the model
        imgWhite = cv2.resize(imgWhite, (224, 224))
        # Normalize pixel values to the range of [0, 1]
        imgWhite = imgWhite.astype('float32') / 255
        imgWhite = np.expand_dims(imgWhite, axis=0)  # Add batch dimension
        prediction = predictor.predict(imgWhite)
        index = np.argmax(np.array(prediction['predictions']))
        class_name = class_names[index]
        return "asl user says : "+str(class_name.split(" ")[1])
    else:
        return "no hand detected"
