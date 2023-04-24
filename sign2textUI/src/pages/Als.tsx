import { Box, Button, Container, Grid} from "@mui/material";
import Webcam from "react-webcam";
import { useRef, useState, useCallback, useEffect, } from "react";
import { useParams } from "react-router-dom";
import Chatbox from "../components/Chatbox";


const Als = () => {

    const videoConstraints = {
        width: 400,
        height: 400,
        facingMode: "user"
    };

    const {roomid} = useParams()

    const [image, setImage] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 750, height: 750 });

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
            console.log(imageSrc);
            try {
                const formData = new FormData();
                formData.append("image", dataURItoBlob(imageSrc));
                formData.append("roomId", roomid+"");

                const response = await fetch(import.meta.env.VITE_IMAGE_SERVICE, {
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
                        <Chatbox 
                        height={window.innerHeight / 1.6 } 
                        roomid={roomid}
                        ></Chatbox>
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