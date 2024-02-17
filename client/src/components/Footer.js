import React, { useState } from 'react'
import {
    Box,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
} from "@mui/material";
import {
    PaperPlaneTilt,
    Smiley,
} from "phosphor-react";
import { styled } from "@mui/material/styles";
import data from "@emoji-mart/data";
import Picker from "emoji-picker-react";
import axios from 'axios';
import { useChat } from '../Context/chat';
import { useAuth } from '../Context/auth';
import { useSnack } from '../Context/SnackBar';
import { connectSocket, socket } from '../Utils/socket';
import { useFetchChat } from '../Context/fetch';
import { useMessages } from '../Context/messages';

const StyledInput = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
      paddingTop: "12px !important",
      paddingBottom: "12px !important",
    },
  }));

const ChatInput = ({ openPicker, setOpenPicker, onChange, value }) => {

    return (
      <StyledInput
        fullWidth
        placeholder="Write a message..."
        variant="filled"
        onChange={onChange}
        value={value}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <Stack sx={{ position: "relative", display: {xs: "none", sm: "block"} }}>
              <InputAdornment position='end' >
                <IconButton
                  onClick={() => {
                    setOpenPicker(!openPicker);
                  }}
                >
                  <Smiley />
                </IconButton>
              </InputAdornment>
            </Stack>
          ),
        }}
      />
    );
};

const Footer = () => {
    const [message, setMessage] = useState("")
    const [selectedChat] = useChat();
    const [fetchChat, setFetchChat] = useFetchChat();
    const [allMessages, setAllMessages] = useMessages();
    const [auth] = useAuth();
    const [openPicker, setOpenPicker] = useState(false);
    const [snack, setSnack] = useSnack();

    if(!socket){
        connectSocket(auth.user)
    }

    const handleEmojiClick = (e) => {
        setMessage((prevValue) => prevValue + e.emoji);
    }

    const sendMessage = async (e) => {
        if((e.key === "Enter" || e.type === 'click')&& message.length > 0){
            try {
              setOpenPicker(false);
              const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/message/send-message`, {chatId: selectedChat._id, content: message});        

              setMessage("");

              socket.emit("new message", data);

              setAllMessages([...allMessages, data]);
              setFetchChat(!fetchChat);
                
            } catch (error) {
                console.log(error);
                setSnack({
                    ...snack,
                    open: true,
                    severity: "error",
                    message: "not send"
                })
            }
        }
    }
    
    const handleTyping = (e) => {
        setMessage(e.target.value);
    }

  
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        width={"100%"}
        sx={{
          backgroundColor: "#F8FAFF",
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
          
        <Stack direction="row" alignItems={"center"} spacing={3} p={2}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 81,
                right: 100,
              }}
            >
              <Picker
                data={data}
                onEmojiClick={(e) => handleEmojiClick(e)}
              />
            </Box>
            {/* Chat Input */}
            
            <Stack onKeyUp={(e) => sendMessage(e)}>
                <ChatInput onChange={(e) => handleTyping(e)} value={message}  openPicker={openPicker} setOpenPicker={setOpenPicker}/>
            </Stack>
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: "#fff",
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%",backgroundColor: "#0162C4", borderRadius: "10px" }}
              alignItems={"center"}
              justifyContent="center"
            >
              <IconButton onClick={(e) => sendMessage(e)}>
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default Footer