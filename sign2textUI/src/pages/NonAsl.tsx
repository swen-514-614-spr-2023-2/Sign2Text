import { useParams } from "react-router-dom";
import Chatbox from "../components/Chatbox";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

const NonAls = () => {

    const { roomid } = useParams()
    return (
        <div className="NonAsl">
            <Container maxWidth="xl" sx={{ marginTop: "3%" }}>
                <Chatbox
                    height={window.innerHeight / 1.6}
                    roomid={roomid}
                ></Chatbox>

            </Container>
        </div>);
}

export default NonAls;