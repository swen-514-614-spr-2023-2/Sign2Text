import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socket.addEventListener("message", (event) => {
      console.log(`Received message from server: ${event.data}`);
      setMessages((prevMessages) => [...prevMessages, String(event.data)]);
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (inputValue.trim()) {
      console.log(`Sending message to server: ${inputValue}`);

      const socket = new WebSocket("ws://localhost:3001");
      socket.addEventListener("open", () => {
        socket.send(inputValue);
        setInputValue("");
        socket.close();
      });
    }
  };

  return (
    <div className="App">
      <div className="producer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter message"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="consumer">
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
