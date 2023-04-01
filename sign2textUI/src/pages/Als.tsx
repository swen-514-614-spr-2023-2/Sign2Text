import { Box, Button, Container, Grid, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import Webcam from "react-webcam";
import { useRef, useState, useCallback, useEffect } from "react";
import { io } from "socket.io-client";


const Als = () => {
    const videoConstraints = {
        width: 400,
        height: 400,
        facingMode: "user"
    };


    const [messages, setMessages] = useState<string[] | []>([]);
    const [image, setImage] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 750, height: 750 });

    const webcamDimensionsRef = useRef(null);
    const webcamRef = useRef<Webcam>(null);

    function dataURItoBlob(dataURI: string) {
        const byteString = atob(dataURI.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: "image/png" });
    }


    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();

        if (imageSrc) {
            setUrl(imageSrc);
            setImage(imageSrc);

            try {
                const formData = new FormData();
                formData.append("image", dataURItoBlob(imageSrc));

                const response = await fetch("http://localhost:5000/upload-image", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
    }, [webcamRef]);


    const socket = io("http://localhost:5000");
    useState(() => {
        socket.on("message", (message) => {
            setMessages((messages) => [...messages, message]);
        });
    }, []);
    const handleResize = () => {
        setDimensions({
            width: window.innerWidth / 1.6,
            height: window.innerHeight / 1.6
        });
    };

    useState(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    return (

        <div className="Asl">
            <Container maxWidth="xl" sx={{ marginTop: "3%" }}>

                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Box display={"flex"} justifyContent="left" sx={{ backgroundColor: "rgb(33, 33, 33)", overflow: "hidden" }}>
                            <Webcam
                                imageSmoothing={true}
                                audio={false}
                                height={dimensions.height}
                                screenshotFormat="image/jpeg"
                                width={dimensions.width}
                                ref={webcamRef}
                                videoConstraints={videoConstraints}></Webcam>
                        </Box>
                        <Button sx={{ marginTop: "1%" }} variant="contained" onClick={capture}>Take a screenshot</Button>

                    </Grid>

                    <Grid item xs={4} >
                        <Paper elevation={8} sx={{ position: "relative", minHeight: window.innerHeight / 1.6 }} >
                            <Typography variant="h2" padding={"4%"} textAlign="center">Chat</Typography>
                            <Box display="flex" flexDirection="column" justifyContent="space-between" sx={{ height: "100%" }}>
                                <Box sx={{height:window.innerHeight / 2.8,overflowY:"scroll"}}>
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
                    </Grid>


                </Grid>


                {url && (
                    <>
                        <Box marginTop={"40%"}>
                            <Button onClick={() => { setUrl(null); }}>
                                delete
                            </Button>
                        </Box>
                        <div>
                            <img src={url} alt="Screenshot" />
                        </div>
                    </>
                )}
            </Container>
        </div>


    );
}

export default Als;