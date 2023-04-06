import { useParams } from "react-router-dom";
import Chatbox from "../components/Chatbox";

const NonAls = () => {

    const {roomid} = useParams()
    return (
        <div className="NonAsl">
            <Chatbox
                height={window.innerHeight / 1.6}
                roomid={roomid}
            ></Chatbox>
        </div>);
}

export default NonAls;