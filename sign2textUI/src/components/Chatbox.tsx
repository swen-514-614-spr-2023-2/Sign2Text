import { Box, Button, Grid, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import { socket } from '../utils/socket';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
interface ChatboxProps {
    roomid: string | undefined
    height: number
}
interface Emessaage {
    topic: string
    message: string
}
const Chatbox = ({ roomid, height }: ChatboxProps) => {


    const [isConnected, setIsConnected] = useState(socket.connected);
    //   const [fooEvents, setFooEvents] = useState([]);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [Emessaages, setEmessaages] = useState<string[] | []>([])
    const [msgEvent, setMsgEvent] = useState([])
    const [emitted, setemitted] = useState(false)
    function onSend(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        socket.emit('message', { topic: roomid, message: value.toString() }, () => {
            console.log("messSent", value.toString());
            setIsLoading(false);
        });
        // socket.timeout(5000).emit('chat message', {roomId : roomid, text : value.toString()}, () => {
        //     setIsLoading(false);
        //     setValue("")
        // });
    }


    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        if (!emitted) {
            socket.emit('subscribe', roomid, () => {
                console.log("roomid sent");
                setemitted(true)

            });
            setemitted(true)
        }


        socket.on("message", (Emessaage: Emessaage) => {
            console.log("messReceived", Emessaage);
            setEmessaages(() => [...Emessaages, Emessaage.message]);
        });
        // socket.on("room#"+roomid, (Emessaage) => {
        //     setEmessaages(() => [...Emessaages, Emessaage.text]);
        // });
        // console.log("mes",messages);
        console.log("Emes", Emessaages);

        // function onFooEvent(message: string) {
        //   setFooEvents((prevMessages) => [...prevMessages, message]);
        // }




        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        // socket.on('foo', onFooEvent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            //   socket.off('foo', onFooEvent);
        };
    }, [Emessaages]);
    return (
        <div className="Chatbox">
            <Paper elevation={8} sx={{ position: "relative", minHeight: height }} >
                <Typography variant="h2" padding={"4%"} textAlign="center">Chat - Room #{roomid}</Typography>
                <Box display="flex" flexDirection="column" justifyContent="space-between" sx={{ height: "100%" }}>
                    <Box sx={{ height: window.innerHeight / 2.8, overflowY: "auto" }}>
                        <List >
                            {Emessaages.map((emessage, index) => (
                                <ListItem key={index}> <Typography>{emessage}</Typography> </ListItem>
                            ))}

                        </List>
                    </Box>

                    <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
                        <form onSubmit={onSend}>
                            <Grid direction="row"
                                justifyContent="center"
                                alignItems="stretch" container spacing={2}>

                                <Grid item xs={9} sx={{}} >
                                    <TextField onChange={e => setValue(e.target.value)}
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