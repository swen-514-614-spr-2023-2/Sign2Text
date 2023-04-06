import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { StyledLink } from "../utils/styles";
import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';


const userTypes = ['ASL', 'Non-ASL'];

interface SimpleDialogProps {
  open: boolean;
  roomid: number;

  onClose: () => void;
}
interface Username {
  name: string
  index: number
}
function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open, roomid } = props;

  const [username, setusername] = useState<Username[]>([{ name: '', index: 0 },{ name: '', index: 1 }])

  const isDisabled = (i: number) => {


    return (username[i].name.trim() === '')
  };

  const handleTextfield = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,index:number) => {

    setusername((prevUsernames) => {
      const newUsernames = [...prevUsernames];
      newUsernames[index].name = e.target.value;
      return newUsernames;
    });
  }

  const handleButt =()=>{
    console.log('handleButt');
  }
  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select User Type</DialogTitle>
      <List sx={{ pt: 0 }}>
        {userTypes.map((type, index) => (
          <ListItem disableGutters>
            {/* <StyledLink to={`/${!index ? "AlsView":"NonAlsView"}/${roomid}`}> */}
              <ListItemText  sx={{ textAlign:"center",marginX:"1%"}} primary={type} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField sx={{ flexGrow: 1 }} onChange={(e) => (handleTextfield(e,index))} id="filled-basic" label="Enter username" variant="filled" />
              <Button sx={{ flexShrink: 0,height:"100%",marginX:"2%"}} variant="contained" onClick={handleButt} disabled={isDisabled(index)}>Go</Button>
            </Box>
            {/* </StyledLink> */}
          </ListItem>
        ))}

      </List>
    </Dialog>
  );
}

export default SimpleDialog