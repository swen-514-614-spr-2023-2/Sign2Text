import { Paper, Typography, Box, ListItemButton, ListItemText, List, ListItem, ListItemIcon } from "@mui/material"
import { Container } from '@mui/material';
import SimpleDialog from "../components/SimpleDialog";
import { ThemeProvider, } from '@mui/material/styles';
import { StyledLink, themeTut } from "../utils/styles";
import HubIcon from '@mui/icons-material/Hub';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";

interface Room {
  roomId: number;
  name: string;
}
export default function Rooms() {

  const [rooms, setrooms] = useState<Room[]>([])
  const [isloading, setisloading] = useState(true)

  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomID, setroomID] = useState<number>(0)

  const handleClickOpen = (roomid: number) => {
    setOpen(true);
    setroomID(roomid)
  };

  const handleClose = () => {
    setOpen(false);

  };


  useEffect(() => {
    const response = fetch("http://localhost:3000/chatroom", {})
      .then(response => {
        // if (!response.ok) {
        //   throw new Error("could not fetch")
        // }
        return response.json()
      })
      .then(data => {
        setrooms(data)
        setisloading(false)
      })
      .catch(error => {
        setisloading(false)
        console.error(error)
      })


  }, [])


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

                {isloading &&

                  <ListItem>
                    <ListItemButton>
                      <ListItemIcon>
                        <HubIcon />
                      </ListItemIcon>
                      <ListItemText primary="Loading rooms..." />
                    </ListItemButton>
                  </ListItem>
                }

                {!isloading && rooms.map((room) => {
                  return (

                    <ListItem key={room.roomId}>
                      <ListItemButton onClick={() => handleClickOpen(room.roomId)}>
                        <ListItemIcon>
                          <HubIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Room " + room.name} />
                      </ListItemButton>
                    </ListItem>)

                })
                }
                <StyledLink to={"/createRoom"}>

                  <ListItem >
                    <ListItemButton>
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText primary="Create a room" >
                      </ListItemText>
                    </ListItemButton>

                  </ListItem>
                </StyledLink>

              </List>
              <SimpleDialog
                open={open}
                onClose={() => setOpen(false)}
                roomid={roomID}
              />
            </Paper>

          </Box>
        </ThemeProvider>
      </Container>


    </div >
  )
}
