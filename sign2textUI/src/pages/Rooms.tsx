import { Paper, Typography, Box, ListItemButton, ListItemText, List, ListItem, ListItemIcon, IconButton } from "@mui/material"
import { Container } from '@mui/material';
import SimpleDialog from "../components/SimpleDialog";
import { ThemeProvider, } from '@mui/material/styles';
import { StyledLink, themeTut } from "../utils/styles";
import HubIcon from '@mui/icons-material/Hub';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const handleDelete = (roomid: number) => {

    const response = fetch('http://18.208.236.128:3000/chatroom', {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ "roomId": roomid })
    })
      .then(response =>{ response.text()
      setrooms(rooms)
    })
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  useEffect(() => {


    const response = fetch('http://18.208.236.128:3000/chatroom', {

    })
      .then(response => {
        // if (!response.ok) {
        //   throw new Error("could not fetch")
        // }
        return response.json()
      })
      .then(data => {
        console.log(rooms.toString());
        console.log(data.toString());
        
        if(rooms.toString()!== data.toString()){
          setrooms(data)
          setisloading(false)}
      })
      .catch(error => {
        setisloading(false)
        console.error(error)
      })


  }, [rooms])


  return (

    <div className="Rooms">

      <Container maxWidth='sm'>
        <ThemeProvider theme={themeTut}>
          <Box marginTop={"20%"} >
            <Paper elevation={5} >
              <Box >
                <Typography paddingTop={"2%"} textAlign={"center"} variant="h3" component="h2">
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
                      <IconButton onClick={() => handleDelete(room.roomId)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
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
