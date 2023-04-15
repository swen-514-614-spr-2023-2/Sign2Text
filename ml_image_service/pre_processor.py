import cv2
import numpy as np
import math
import time
from cvzone.HandTrackingModule import HandDetector
from matplotlib import pyplot as plt

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


        imgWhite = cv2.resize(imgWhite, (224, 224)) # Resize the image to the input size of the model
        imgWhite = imgWhite.astype('float32') / 255 # Normalize pixel values to the range of [0, 1]
        plt.imshow(imgWhite, interpolation='nearest')
        plt.show()
        imgWhite = np.expand_dims(imgWhite, axis=0) # Add batch dimension

        return imgWhite
    else:
        return "no hand detected"
