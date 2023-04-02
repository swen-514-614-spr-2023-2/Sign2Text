import { useParams } from "react-router-dom";
import Chatbox from "../components/Chatbox";

const NonAls = () => {

    const {roomid} = useParams()
    const messages:string[] = [];
    return (
        <div className="NonAsl">
            <Chatbox
                height={window.innerHeight / 1.6}
                roomid={roomid}
                messages={messages}
            ></Chatbox>
        </div>);
}

export default NonAls;