import { Box, Button, Grid, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import { socket } from '../utils/socket';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Kafka, EachMessagePayload  } from 'kafkajs';


interface ChatboxProps {
    roomid: string | undefined
    height: number
}
type Message = {
    value: string;
  }
const Chatbox2 = ({  roomid, height }: ChatboxProps) => {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092']
      });
    const [isConnected, setIsConnected] = useState(socket.connected);
    //   const [fooEvents, setFooEvents] = useState([]);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    function onSend(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        sendMessage(value);
        console.log("dsdasd");
        
        console.log(messages);
        
        setValue("")
    }

    const sendMessage = async (message: string) => {
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
          topic: 'chat-messages',
          messages: [
            { value: message }
          ]
        });
        await producer.disconnect();
      }


    useEffect(() => {
        const consumer = kafka.consumer({ groupId: 'my-group' });
    
        const run = async () => {
          await consumer.connect();
          await consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });
    
          const run = async (): Promise<void> => {
            await consumer.connect();
            await consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });
      
            await consumer.run({
              eachMessage: async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
                console.log({
                  value: message.value.toString(),
                });
                setMessages(prevMessages => [...prevMessages, message.value.toString()]);
              },
            });
          };  }  
        run().catch(console.error);
    
        return () => {
          consumer.disconnect();
        }
    
      }, []);


    return (
        <div className="Chatbox">
            <Paper elevation={8} sx={{ position: "relative", minHeight: height }} >
                <Typography variant="h2" padding={"4%"} textAlign="center">Chat - Room #{roomid}</Typography>
                <Box display="flex" flexDirection="column" justifyContent="space-between" sx={{ height: "100%" }}>
                    <Box sx={{ height: window.innerHeight / 2.8, overflowY: "scroll" }}>
                        <List >
                            {messages.map((message, index) => (
                                <ListItem key={index}>{message.value}</ListItem>
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
                                    <Button type="submit"  variant="contained" sx={{ width: "80%", height: "80%", }}>send</Button>
                                </Grid>
                        </Grid>
                    </form>

                    </Box>
                </Box>
            </Paper>

        </div>
    );
}

export default Chatbox2;