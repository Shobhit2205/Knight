import React, { useEffect, useState } from 'react'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useAuth } from '../Context/auth'
import { useSnack } from '../Context/SnackBar'
import { getLatestMsg, getName } from '../Utils/chatLogic'
import ProfileDialog from './Dialogs/ProfileDialog'

const ChatElement = ({el}) => {
    const [auth] = useAuth();
    const [openProfile, setOpenProfile] = useState(false);
    const [pic, setPic] = useState("");
    const [snack, setSnack] = useSnack();

    const handleCloseProfile = () => {
        setOpenProfile(false);
    }
    const handleOpenProfile = () => {
        setOpenProfile(true);
    }

    const getPicture = async (el) => {
        setPic("");
        if(!el) return;
        try {
          const id = el.isGroupChat ? el?._id : el?.users[0]?._id === auth?.user?._id ? el?.users[1]?._id : el?.users[0]?._id;
  
          const url = el?.isGroupChat ? "chats/get-group-dp" : "user/get-picture";
  
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
        getPicture(el);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [el])


    const getTime = () => {
        const msgDate = new Date(el.latestMessage?.createdAt);
        const d1 = new Date(el.latestMessage?.createdAt).getTime();
        const d2 = new Date().getTime();
        const diff = d2 - d1;
        const oneDay = 12*60*60*1000;

        if(diff < oneDay){
            return msgDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
        }
        else if(diff >= oneDay && diff < 2*oneDay){
            return `yesterday`;
        }
        else{
            return msgDate.toLocaleDateString();
        }

    }
  
  return (
      <>
        <Box 
        p={2}
        sx={{
            // width: "100%",
            // height: "50px",
            borderRadius: 1,
            border: "1px solid rgba(0, 0, 0, 0.25)",
            backgroundColor: "#fcfcfc",
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" >
                <Stack direction="row" spacing={2}>
                    <Avatar onClick={handleOpenProfile} src={pic ? URL.createObjectURL(pic) : ""} alt={"image"} />
                    <Stack spacing={0.3}>
                        <Typography variant='subtitle2'>{getName(el, auth).slice(0, 20)}</Typography>
                        <Typography variant='caption'>{`${el?.latestMessage ? getLatestMsg(el, auth.user).slice(0, 22) : "Tap to start chat"}`}</Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems="center">
                    
                    {el.latestMessage && <Typography sx={{ fontWeight: 600 }} variant="caption">{getTime()}</Typography>}
                </Stack>
            </Stack>
        </Box>
        {openProfile && <ProfileDialog open={openProfile} handleClose={handleCloseProfile} />}
    </>
  )
}

export default ChatElement