import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import io from "socket.io-client";

const Camera = () => {
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [resizedImage, setResizedImage] = useState(null);

  const webcamRef = React.useRef(null);
  const socket = io("http://sign2text.duckdns.org:5000");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const capture = React.useCallback(() => {
    setImage(null);
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 400;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          setResizedImage(blob);
          const formData = new FormData();
          formData.append("image", blob, "image.jpg");
          axios
            .post("http://sign2text.duckdns.org:5000/upload-image", formData)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.error(error);
            });
        },
        "image/jpeg",
        0.7
      );
    };
    img.src = imageSrc;
    setTimeout(() => {
      setImage(null); // reset the image state to null after 1 second
    }, 1000);
  }, [webcamRef]);

  return (
    <div>
      <div style={{ float: "left", width: "70%" }}>
        {resizedImage ? (
          <img src={URL.createObjectURL(resizedImage)} />
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            <button onClick={capture}>Capture photo</button>
          </>
        )}
        {resizedImage && (
          <img
            src={URL.createObjectURL(resizedImage)}
            style={{ display: "none" }}
            onLoad={(e) => {
              setTimeout(() => {
                setResizedImage(null); // reset the resized image state to null after 1 second
              }, 1000);
            }}
          />
        )}
      </div>
      <div style={{ float: "right", width: "30%" }}>
        <h2>Chat</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Camera;
