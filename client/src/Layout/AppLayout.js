import { Box, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Chats from '../components/Chats'
import Conversation from '../components/Conversation'
import { useAuth } from '../Context/auth'
import { useChat } from '../Context/chat'
import { useFetchChat } from '../Context/fetch'
import { useMessages } from '../Context/messages'
import {socket, connectSocket} from "../Utils/socket"

const AppLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const authuser = localStorage.getItem("auth")
        if(!authuser){
            return navigate("/auth/login");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const [auth] = useAuth();
    const [selectedChat] = useChat();
    const [fetchChat, setFetchChat] = useFetchChat();
    const [allMessages, setAllMessages] = useMessages();
    useEffect(() => {
        if(auth.user){
            if(!socket) connectSocket(auth?.user);
        }
    }, [auth])

    useEffect(() => {
        if(!socket) return;
        socket.on("message recieved", (newMessageRecieved) => {
            setFetchChat(!fetchChat);
            if(!selectedChat || selectedChat._id !== newMessageRecieved.chat._id){
                console.log("newMessageRecieved", newMessageRecieved)
            }
            else{
                setAllMessages([...allMessages, newMessageRecieved]);    
            }
            
        })
    })
    
  return (
    <Stack direction="row" sx={{width: "100vw", height: "100vh"}}>
        <Stack sx={{width: {xs: `${selectedChat ? "0" : "100vw"}`, sm: `${selectedChat ? "0" : "100vw"}`, md: "350px", lg: "350px"}}}>
            <Chats/>
        </Stack>
        <Box
        sx={{
          height: "100vh",
          width: { xs: `${selectedChat ? "100vw" : "0"}`, sm : `${selectedChat ? "100vw" : "0"}`, md: "calc(100vw - 350px)", lg: "calc(100vw - 350px)"},
          backgroundColor: "#F0F4FA",
        }}
        >
            <Conversation/>
        </Box>
    </Stack>
  )
}

export default AppLayout