import { Paper, Typography, Box, ListItemButton, ListItemText, List, ListItem, ListItemIcon } from "@mui/material"
import { Container } from '@mui/material';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StyledLink, themeTut } from "../utils/styles";
import HubIcon from '@mui/icons-material/Hub';
import AddIcon from '@mui/icons-material/Add';


export default function Rooms() {
  return (
    <div className="Rooms">
      <Container maxWidth='sm'>
        <ThemeProvider theme={themeTut}>
          <Box marginTop={"20%"} >
            <Paper elevation={5} >
              <Box >
                <Typography textAlign={"center"} variant="h3" component="h2">
                  Rooms
                </Typography>
              </Box>
              <List sx={{ display: "relative", marginX: "auto" }} >
                <ListItem >
                  <ListItemButton>
                    <ListItemIcon>
                      <HubIcon />
                    </ListItemIcon>
                    <StyledLink to="/AlsView/1">
                      <ListItemText primary="Room 1" />
                    </StyledLink>
                  </ListItemButton>
                </ListItem>
                <ListItem >
                  <ListItemButton>
                    <ListItemIcon>
                      <HubIcon />
                    </ListItemIcon>
                    <ListItemText primary="Room 2" />
                  </ListItemButton>
                </ListItem>
                <ListItem >
                  <ListItemButton>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create a room" >
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </List>
            </Paper>

          </Box>
        </ThemeProvider>
      </Container>


    </div>
  )
}
