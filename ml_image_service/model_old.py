import tensorflow as tf

import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
from werkzeug.datastructures import FileStorage

new_model = tf.keras.models.load_model('asl_base_model2.h5')


def getPrediction(file):
    # assume file_storage is a FileStorage object containing image data
    image_data = file.read()
    image_array = np.frombuffer(image_data, dtype=np.uint8)
    img = cv2.imdecode(image_array, flags=cv2.IMREAD_COLOR)
    # img = cv2.imread(file)
    RGB_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    # plt.imshow(RGB_img)
    img = cv2.resize(img, (32, 32))
    img = img.reshape(1, 32, 32, 3)
    prediction = new_model.predict(img/255.0)[0]
    seq_chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
                 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']
    return seq_chars[list(prediction).index(max(list(prediction)))]
    # plt.imshow(img)
