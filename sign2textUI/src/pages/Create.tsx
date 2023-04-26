import { Alert, Box, Container, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Create = () => {

  const [chatroomName, setChatroomName] = useState("");
  const [maxMembersError, setMaxMembersError] = useState("");
  const [chatroomId, setChatroomId] = useState("");
  const [maxMembers, setMaxMembers] = useState(1);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = fetch(import.meta.env.VITE_CHATROOM_SERVICE_CREATE, {
      method: "POST",
      body: JSON.stringify({ name: chatroomName }),
      headers: {
        "Content-Type": "application/json",

      }

    }).then((res) => {
      setSuccessMessage("Chatroom " + chatroomName + " created successfully")
      setTimeout(() => {
        navigate("/rooms")
      }, 1500);
      console.log(res)
    })
      .catch((error) => {
        setError(true)
        console.log(error)
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

  return (
    <div className="Create" >

      <Container maxWidth='sm'>
        <Box marginTop={"20%"} >
          <Paper elevation={5} sx={{ padding: "4%" }} >
            <form onSubmit={handleSubmit}>

              <Box>


                <TextField
                  label="Chatroom Name"
                  id="outlined-required"
                  value={chatroomName}
                  onChange={(e) => setChatroomName(e.target.value)}
                  required
                  style={{ width: "100%" }}
                />
              </Box>


              <Box>
                {/* 
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
              /> */}
              </Box>

              <Button type="submit" variant="contained" color="primary" style={{ display: "block", margin: "1rem auto" }} >
                Create Chatroom
              </Button>
            </form>

          </Paper>
          <Box marginTop={"2%"}>
              {successMessage != "" && <Alert severity="success">{successMessage}</Alert>}
              {error && <Alert severity="error">Room not created</Alert>}
            </Box>

        </Box>
      </Container>
    </div>
  );
}

export default Create;
