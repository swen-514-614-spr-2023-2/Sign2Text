import { Paper } from "@mui/material";
// import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const Create = () => {

  const [chatroomName, setChatroomName] = useState("");
  const [chatroomId, setChatroomId] = useState("");
  const [maxMembers, setMaxMembers] = useState(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = fetch(`https://localhost:3000/chatroom`, {
      method: "POST",
      body: JSON.stringify({ name: chatroomName }),

    }).then((res) => {
      console.log(res)
      console.log(res.type)
    })
      .catch((error) => {
        console.log(error)
        console.log(error.type)
      });
  };

  const handleMaxMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value < 1 || value > 100) {
      // If the value is out of range, set the error state
      setMaxMembersError("Number of members should be between 1 and 100");
    } else {
      // Otherwise, clear the error state
      setMaxMembersError("");
    }
    setMaxMembers(value);
  };

  const [maxMembersError, setMaxMembersError] = useState("");




  /** Usage returns typed data */





  return (
    <Paper
    >
      <div className="Create" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>


        <form onSubmit={handleSubmit}>
          <TextField
            label="Chatroom Name"
            id="outlined-required"
            value={chatroomName}
            onChange={(e) => setChatroomName(e.target.value)}
            required
            style={{ width: "100%" }}
          />

          <TextField
            label="Max Members"
            id="outlined-number"
            type="number"
            value={maxMembers}
            onChange={handleMaxMembersChange}
            inputProps={{ min: 1, max: 100 }}
            error={Boolean(maxMembersError)}
            helperText={maxMembersError}
            style={{ width: "100%" }}
            InputLabelProps={{
              shrink: true,
            }}

          />

          <Button type="submit" variant="contained" color="primary" style={{ display: "block", margin: "1rem auto" }} >
            Create Chatroom
          </Button>
        </form>


      </div>
    </Paper>);
}

export default Create;