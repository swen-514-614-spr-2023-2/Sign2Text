import {styled} from "@mui/material/styles";
import { Link } from "react-router-dom";
import { createTheme } from "@mui/material";
import red from "@mui/material/colors/red";

export const StyledLink = styled(Link)
`
color: black; 
text-decoration: none;
`;

export const themeTut = createTheme({
    components: {
      MuiTypography: {
        variants: [
          {
            props: {
              variant: "h3"
            },style:{
              fontSize:40,
              paddingtop:"10px"
            }
  
          },
        ]
      },
      
    },
    palette: {
      background: {
        default: '#e6e9ec',
      },
    },
  });