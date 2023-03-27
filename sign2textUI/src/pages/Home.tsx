import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import "../styles/Home.css"
import {StyledLink} from '../utils/styles'


const Home = () => {
    return (
        <div className="Home">
            <div className="Hero">
                <h1>Sign2Text</h1>
                <StyledLink to="/rooms"><Button href="#text-buttons" variant="outlined">Find Rooms</Button></StyledLink> 
            </div>
        </div>
    );
}

export default Home;