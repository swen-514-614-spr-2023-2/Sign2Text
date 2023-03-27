import { Box, Button, Container } from "@mui/material";
import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";

const Als = () => {
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };
    const [url, setUrl] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setUrl(imageSrc)
            console.log(imageSrc);

        }
    }, [webcamRef]);


    return (

        <div className="Asl">
            <Container maxWidth="lg" sx={{ marginTop: "3%" }}>
                <Box>
                    <Webcam
                        imageSmoothing={true}
                        audio={false}
                        height={720}
                        screenshotFormat="image/png"
                        width={1280}
                        ref={webcamRef}
                        videoConstraints={videoConstraints}></Webcam>
                </Box>
                <Button sx={{ display: "flex", justifyContent: "center" }} variant="contained" onClick={capture}>Take a screenshot</Button>
                {url && (
                    <>
                        <div>
                            <button onClick={() => {  setUrl(null); }}>
                                delete
                            </button>
                        </div>
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