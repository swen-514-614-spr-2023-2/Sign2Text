import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import { StyledLink, themeTut } from "../utils/styles";


const userTypes = ['ALS', 'Non-ALS'];

export interface SimpleDialogProps {
  open: boolean;
  roomid: number;
  onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open,roomid } = props;

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
        {userTypes.map((type) => (
          <ListItem disableGutters>
            <StyledLink to={"/AlsView/" + roomid}>
              <ListItemButton onClick={() => handleListItemClick()} key={type}>
                <ListItemText primary={type} />
              </ListItemButton>
            </StyledLink>
          </ListItem>
        ))}

      </List>
    </Dialog>
  );
}

export default SimpleDialog