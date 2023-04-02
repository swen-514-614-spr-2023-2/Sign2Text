import { Box, Button, Grid, List, ListItem, Paper, TextField, Typography } from "@mui/material";

interface ChatboxProps{
    messages:string[]
    roomid:string | undefined
    height:number  
}


const Chatbox = ({messages,roomid,height}:ChatboxProps) => {


    return (
        <div className="Chatbox">
            <Paper elevation={8} sx={{ position: "relative", minHeight: height}} >
                <Typography variant="h2" padding={"4%"} textAlign="center">Chat - Room #{roomid}</Typography>
                <Box display="flex" flexDirection="column" justifyContent="space-between" sx={{ height: "100%" }}>
                    <Box sx={{ height: window.innerHeight / 2.8, overflowY: "scroll" }}>
                        <List >
                            {messages.map((message, index) => (
                                <ListItem key={index}>{message}</ListItem>
                            ))}

                        </List>
                    </Box>

                    <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
                        <Grid direction="row"
                            justifyContent="center"
                            alignItems="stretch" container spacing={2}>
                            <Grid item xs={9} sx={{}} >
                                <TextField id="outlined-basic" label="Message" sx={{ padding: "2%", width: "98%" }} variant="outlined" />
                            </Grid>
                            <Grid item xs={3} sx={{
                                display: "flex", justifyContent: "center",
                                flexWrap: "nowrap",
                                alignItems: "center",
                                paddingLeft: "0px"
                            }}>
                                <Button variant="contained" sx={{ width: "80%", height: "80%", }}>send</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>

        </div>
    );
}

export default Chatbox;