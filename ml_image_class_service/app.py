import model
from datetime import datetime
import time
import random
import base64
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask import Flask, request, jsonify


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")
#  async_mode='eventlet',


@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return 'No image provided', 400

    file = request.files['image']
    # file.save(datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f") + ".jpg")
    # filename = datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f") + "-" + \
    #     str(random.randint(100000, 999999)) + ".jpg"
    # file.save(filename)
    socketio.emit('message', model.getPrediction(file))
    # socketio.emit('message', "predicted")
    return 'Image uploaded successfully', 200


if __name__ == '__main__':
    # socketio.start_background_task(send_random_message)
    socketio.run(app, debug=True)
