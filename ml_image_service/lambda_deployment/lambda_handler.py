import numpy as np
import sagemaker
from sagemaker.tensorflow.model import TensorFlowModel
import cv2
import numpy as np
import math
from cvzone.HandTrackingModule import HandDetector

sagemaker_session = sagemaker.Session(
    default_bucket="sagemaker-us-east-1-707043296968")
predictor = sagemaker.tensorflow.model.TensorFlowPredictor(endpoint_name="tensorflow-inference-2023-04-18-16-14-27-337",
                                                           sagemaker_session=sagemaker_session)

detector = HandDetector(maxHands=1)
offset = 20
imgSize = 300


def getPrediction(event, context):
    # Decode the base64-encoded image sent in the event
    encoded_image = event['body']
    image_data = base64.b64decode(encoded_image)
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

        print("before_prediction: ")
        result = predictor.predict(imgWhite)
        print("sage result: ", result)
        class_names = open("Model/labels.txt", "r").readlines()
        index = np.argmax(np.array(result['predictions']))
        class_name = class_names[index]
        print("class_name: ", class_name)
        return {
            'statusCode': 200,
            'body': class_name
        }

    else:
        print("class_name: ", "none detected")
        return {
            'statusCode': 400,
            'body': 'No hand detected'
        }
