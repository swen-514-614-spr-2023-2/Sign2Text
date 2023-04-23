import boto3
import json
import pre_processor
import numpy as np
# import tensorflow as tf


# Set up the SageMaker runtime client

import sagemaker
from sagemaker.tensorflow.model import TensorFlowModel

# Set up the SageMaker session and TensorFlow predictor
sagemaker_session = sagemaker.Session(
    default_bucket="sagemaker-us-east-1-707043296968")
# inputs = sagemaker_session.upload_data(path='model_deploy.tar.gz', key_prefix='model')
predictor = sagemaker.tensorflow.model.TensorFlowPredictor(
    endpoint_name="tensorflow-inference-2023-04-18-16-14-27-337",
    sagemaker_session=sagemaker_session
)


with open("/Users/poorna/Downloads/Photo3.jpg", "rb") as f:
    processed_image = pre_processor.getPrediction(f)

print(type(processed_image))

result = predictor.predict(processed_image)
print(result)

class_names = open("Model/labels.txt", "r").readlines()
index = np.argmax(np.array(result['predictions']))
class_name = class_names[index]
print(class_name)
