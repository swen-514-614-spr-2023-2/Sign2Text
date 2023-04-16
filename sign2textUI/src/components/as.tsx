import { Box, Button, Grid, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import { socket } from '../utils/socket';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface ChatboxProps {
  roomid: string | undefined
  height: number
}

const Chatbox = ({ roomid, height }: ChatboxProps) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [Emessaages, setEmessaages] = useState<string[] | []>([])

  function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    socket.emit('message', value.toString(), () => {
      setIsLoading(false);
      setValue('');
    });
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("message", (message: string) => {
      setEmessaages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="Chatbox">
      <Paper elevation={8} sx={{ position: "relative", minHeight: height }} >
        <Typography variant="h2" padding={"4%"} textAlign="center">Chat - Room #{roomid}</Typography>
        <Box display="flex" flexDirection="column" justifyContent="space-between" sx={{ height: "100%" }}>
          <Box sx={{ height: window.innerHeight / 2.8, overflowY: "scroll" }}>
            <List >
              {Emessaages.map((emessage, index) => (
                <ListItem key={index}>{emessage}</ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
            <form onSubmit={onSend}>
              <Grid direction="row"
                justifyContent="center"
                alignItems="stretch" container spacing={2}>
                <Grid item xs={9} sx={{}}>
                  <TextField onChange={e => setValue(e.target.value)}
                    value={value}
                    id="outlined-basic" label="Message" sx={{ padding: "2%", width: "98%" }} variant="outlined" />
                </Grid>
                <Grid item xs={3} sx={{
                  display: "flex", justifyContent: "center",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  paddingLeft: "0px"
                }}>
                  <Button type="submit" variant="contained" sx={{ width: "80%", height: "80%", }}>send</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default Chatbox;