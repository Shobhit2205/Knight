import { Box, CircularProgress } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../Context/auth';
import { useChat } from '../Context/chat';
import { useSnack } from '../Context/SnackBar';
import MessagesBox from './MessageBox';
import {connectSocket, socket} from "../Utils/socket"
import { useMessages } from '../Context/messages';


const Message = () => {
    const [selectedChat] = useChat();
    const [allMessages, setAllMessages] = useMessages();
    const [auth] = useAuth();
    const [snack, setSnack] = useSnack();
    const [loading, setLoading] = useState(false);

    if(!socket){
      connectSocket(auth.user)
    }

    const fetchMessages = async () => {
        if(!selectedChat) return;  
        try {
          setLoading(true);
          const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/message/get-messages/${selectedChat._id}`);


          socket.emit("join chat", selectedChat._id);
          setAllMessages(data.messages);
          setLoading(false);
            
        } catch (error) {
          console.log(error);
          setLoading(false);
          setSnack({
            ...snack,
            open: true,
            severity: "error",
            message: error.response.data.message
          })
        }
    }

    useEffect(() => {
        fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat])

  return (
    <>
      <Box width="100%" sx={{ flexGrow: 1, height: "100%", overflowY: "scroll" }}>
          <Box p={2} >
              {loading ? 
              <Box sx={{ width: "100%", height:"70vh", display:"flex", alignItems: "center", justifyContent: "center"}}>
                  <CircularProgress  size="8rem" />
              </Box>  : 
              <Box p={3}>
                  <MessagesBox messages={allMessages} /> 
              </Box>}
          </Box>
      </Box>
    </>
  )
}

export default Message