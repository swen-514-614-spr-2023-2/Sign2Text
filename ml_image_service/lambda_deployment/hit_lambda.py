import requests
import base64

# Load the image
with open("/Users/poorna/Downloads/Photo3.jpg", "rb") as f:
    image_bytes = f.read()

# Encode the image as base64
encoded_image = base64.b64encode(image_bytes).decode('utf-8')

# Define the request payload
payload = {
    "body": encoded_image
}

# Send the request to the API Gateway endpointtest
url = "https://4jm62z8f09.execute-api.us-east-1.amazonaws.com/lamda-trigger"
response = requests.post(url, json=payload)

# Print the response
print(response.json())
