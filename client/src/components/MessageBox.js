import React, { useEffect, useRef } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import ScrollableFeed from 'react-scrollable-feed'
import { useAuth } from '../Context/auth'
import { useChat } from '../Context/chat'
import { isFirstMessage } from '../Utils/chatLogic'

const MessageBox = ({messages}) => {
    const [auth] = useAuth();
    const [selectedChat] = useChat();

    const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
      <>
        <ScrollableFeed>
            <Stack spacing={2}> 
                {messages && messages.map((m, i) => (
                    <Stack ref={messagesEndRef} direction="row" spacing={1} justifyContent={`${m.sender._id === auth.user._id ? "end" : "start"}`} key={m._id} >
                        <Box p={1.5}  sx={{backgroundColor: `${m.sender._id === auth.user._id ? "#0162C4" : "#fff"}`, borderRadius: 3, width: "max-content", maxWidth: "80%", margin: 20}} >
                            {selectedChat.isGroupChat && m.sender._id !== auth.user._id && isFirstMessage(messages, m, i) &&
                            <Typography variant='subtitle2' color="blue" >{`${m.sender.firstName} ${m.sender.lastName}`}</Typography>}
                                
                            <Typography variant='body2' fontSize={16} color={`${m.sender._id === auth.user._id ? "#fff" : "#000"}`}>{m.content}</Typography>
                        </Box>
                    </Stack>
                ))}
            </Stack>
        </ScrollableFeed>
    </>
  )
}

export default MessageBox