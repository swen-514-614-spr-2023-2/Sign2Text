import boto3
import json
import pre_processor
import numpy as np
# import tensorflow as tf



# Set up the SageMaker runtime client
# sagemaker_runtime_client = boto3.client('sagemaker-runtime')
import sagemaker
from sagemaker.tensorflow.model import TensorFlowModel

# Set up the SageMaker session and TensorFlow predictor
sagemaker_session = sagemaker.Session(default_bucket= "sagemaker-us-east-1-707043296968")
# inputs = sagemaker_session.upload_data(path='model_deploy.tar.gz', key_prefix='model')
predictor = sagemaker.tensorflow.model.TensorFlowPredictor(
    endpoint_name="tensorflow-inference-2023-04-14-23-51-40-654",
    sagemaker_session=sagemaker_session
)


with open("/Users/poorna/Downloads/Photo3.jpg", "rb") as f:
    processed_image = pre_processor.getPrediction(f)

print(type(processed_image))
# payload = processed_image.tobytes()
# payload = np.array2string(processed_image, separator=',', max_line_width=np.inf).encode('utf-8')
# payload = processed_image.tolist() 
# response = sagemaker_runtime_client.invoke_endpoint(EndpointName="tensorflow-inference-2023-04-14-22-42-08-304", Body=json.dumps(payload),
#     ContentType='application/json')
# result = response['Body'].read().decode()
result = predictor.predict(processed_image)
print(result)

# print(processed_image)
# model = tf.keras.models.load_model("/Users/poorna/Documents/Projects/signToTextCameraExperiemnts/new_project/team-1/ml_image_service/Model/keras_model.h5")
# result = model.predict(processed_image)
# print(result)
class_names = open("Model/labels.txt", "r").readlines()
index = np.argmax(np.array(result['predictions']))
class_name = class_names[index]
print(class_name)


# # Define the endpoint name and content type
# endpoint_name = 'tensorflow-inference-2023-04-14-20-59-52-938'
# content_type = 'text/csv'

# # Define the input data
# input_data = '1,2,3,4,5'

# # Invoke the endpoint and get the prediction
# response = sagemaker_runtime_client.invoke_endpoint(
#     EndpointName=endpoint_name,
#     ContentType=content_type,
#     Body=input_data
# )

# # Parse the prediction result
# result = json.loads(response['Body'].read().decode())

# # Print the prediction result
# print(result)
