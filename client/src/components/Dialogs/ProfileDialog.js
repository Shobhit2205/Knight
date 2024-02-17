import { Avatar, Dialog, DialogContent, DialogContentText, DialogTitle, Slide, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/auth';
import { useChat } from '../../Context/chat';
import { useSnack } from '../../Context/SnackBar';
import { getEmail, getName } from '../../Utils/chatLogic';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const ProfileDialog = ({open, handleClose}) => {
    const [selectedChat] = useChat();
    const [auth] = useAuth();
    const [snack, setSnack] = useSnack();
    const [pic, setPic] = useState();

    const getPicture = async () => {
      setPic("");
      try {
        const id = selectedChat.isGroupChat ? selectedChat._id : selectedChat.users[0]._id === auth.user._id ? selectedChat.users[1]._id : selectedChat.users[0]._id;

        const url = selectedChat.isGroupChat ? "chats/get-group-dp" : "user/get-picture";

        const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/${url}/${id}`, {responseType: "blob"});

        setPic(res.data);
        
      } catch (error) {
        console.log(error);
        setSnack({
          ...snack,
          open: true,
          severity: "error",
          message: "can not get picture"
        })
      }
    }

    useEffect(() => {
      getPicture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat])

  return (
    <>
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{display: "flex", alignItems: "center", justifyContent: "center"}} >
            <Avatar sx={{width: "200px", height: "200px"}} src={pic ? URL.createObjectURL(pic) : ""} alt={"Image"} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" sx={{textAlign: "center"}}>
                <Typography sx={{color: "black"}} component="div" variant='subtitle'>{`${selectedChat.isGroupChat ? "Group Name" : "Name"} : ${getName(selectedChat, auth)}`}</Typography>

                {selectedChat.isGroupChat && <Typography sx={{color: "black"}} component="div" variant='subtitle'>{`Admin : ${selectedChat.groupAdmin.firstName} ${selectedChat.groupAdmin.lastName}`}</Typography>}

                <Typography sx={{color: "black"}} component="div" variant='subtitle'>{`${selectedChat.isGroupChat ? "Admin Email" : "Email"} : ${getEmail(selectedChat, auth)}`}</Typography>
          </DialogContentText>
        </DialogContent>
        
      </Dialog>
    </>
  )
}

export default ProfileDialog