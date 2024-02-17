import React from 'react'
import { Box, Stack } from '@mui/material'
import Header from './Header'
import { useChat } from '../Context/chat'
import Message from './Message'
import Footer from './Footer'


const Conversation = () => {
    const [selectedChat] = useChat();

  return (
      <>
        {selectedChat ? 
        <Stack height="100vh" maxHeight="100vh" width="100%">
            <Header />

            <Box
                width="100%"
                sx={{ flexGrow: 1, height: "100%", overflowY: "scroll" }}
            >
                <Message />
            </Box>

            <Footer />
        </Stack> 
        : <></>}
    </>
    
  )
}

export default Conversation