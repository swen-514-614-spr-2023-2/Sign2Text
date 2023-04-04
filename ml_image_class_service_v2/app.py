import model
from datetime import datetime
import time
import random
import base64
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask import Flask, request, jsonify
import requests


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
# socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")
#  async_mode='eventlet',


@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.form:
        return 'No image provided', 400
    room_ = request.form['roomid']
    file_ = request.form['image']

    url = 'http://localhost:3000/prediction'  # replace with the URL of the other service's API endpoint
    data = {'text': model.getPrediction(file_), 'roomid': room_}  # replace with the data you want to send in the request

    response = requests.post(url, json=data)

    # socketio.emit('message', model.getPrediction(file_))

    return 'Image uploaded successfully', 200


if __name__ == '__main__':
    # socketio.start_background_task(send_random_message)
    app.run( debug=True)
