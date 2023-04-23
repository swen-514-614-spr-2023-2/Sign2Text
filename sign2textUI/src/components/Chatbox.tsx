import { Box, Button, Grid, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import { socket } from '../utils/socket';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
interface ChatboxProps {
    roomid: string | undefined
    height: number
}
interface Emessaage {
    roomId: string
    text: string
}
const Chatbox = ({ roomid, height }: ChatboxProps) => {


    const [isConnected, setIsConnected] = useState(socket.connected);
    //   const [fooEvents, setFooEvents] = useState([]);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [Emessaages, setEmessaages] = useState<string[] | []>([])
    const [msgEvent, setMsgEvent] = useState([])
    const [emitted, setemitted] = useState(false)

    const submissionBox = useRef<HTMLDivElement>(null)
    const CBheight = useRef<HTMLDivElement>(null)
    const [msgHeight, setmsgHeight] = useState(0)
    const messageElm= useRef(null) 
    const subBox = useRef(null)



    function onSend(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        // console.log(textField.current.target.value)
        socket.emit('chat message', {roomId : roomid, text : value}, () => {
            console.log("messSent", value.toString());
           
            setIsLoading(false);
        });
         setValue("")

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

        const paperHeight = CBheight?.current?.clientHeight
        console.log(paperHeight);
        
        const listHeight = submissionBox?.current?.clientHeight;
        console.log(listHeight);
        
        setmsgHeight( paperHeight - (listHeight*2.3) );

        if (!emitted) {
            socket.emit('subscribe', roomid, () => {
                console.log("roomid sent");
                setemitted(true)

            });
            setemitted(true)
        }


        socket.on("room#"+roomid, (Emessaage: Emessaage) => {
            console.log("messReceived", Emessaage);
            
            setEmessaages(() => [...Emessaages, Emessaage.text]);
            if (CBheight.current) {
                CBheight.current.scrollTop = CBheight.current.scrollHeight - CBheight.current.clientHeight;
                          }
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
            <Paper ref={CBheight}  elevation={8} sx={{ position: "relative", minHeight: height}} >
                <Typography variant="h2" padding={"4%"} textAlign="center">Room #{roomid}</Typography>
                <Box  display="flex" flexDirection="column" justifyContent = "space-between" >
                    <Box  sx={{ marginTop:"-3.8%", height: msgHeight, overflowY: "auto" ,backgroundColor:"#ebebeb"}}>
                        <List >
                            {Emessaages.map((emessage, index) => (
                                <ListItem ref={messageElm} key={index}> <Typography>{emessage}</Typography> </ListItem>
                            ))}

                        </List>
                    </Box>

                    <Box ref ={submissionBox} sx={{ position: "absolute", bottom: 0, width: "100%" }}>
                        <form onSubmit={onSend}>
                            <Grid direction="row"
                                justifyContent="center"
                                alignItems="stretch" container spacing={2}>

                                <Grid item xs={9} sx={{}} >
                                    <TextField value={value}  onChange={e => setValue(e.target.value)}
                                        id="outlined-basic" label="" sx={{ padding: "2%", width: "98%" }} variant="outlined" />
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