import React, { useEffect, useState } from 'react'
import { Avatar, Box, IconButton, Stack, Typography, Menu, MenuItem } from '@mui/material'
import { useAuth } from '../Context/auth';
import { CaretLeft, DotsThreeVertical } from 'phosphor-react';
import { useChat } from '../Context/chat';
import { getName } from '../Utils/chatLogic';
import ProfileDialog from './Dialogs/ProfileDialog';
import EditGroupDialog from "./Dialogs/EditGroupDialog"
import { useSnack } from '../Context/SnackBar';
import axios from 'axios';
import { useFetchChat } from '../Context/fetch';

const Header = () => {
    const [selectedChat, setSelectedChat] = useChat();
    const [fetchChatsAgain, setFetchChatsAgain] = useFetchChat();
    const [snack, setSnack] = useSnack();
    const [openProfile, setOpenProfile] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openEditGroup, setOpenEditGroup] = useState(false);
    const [pic, setPic] = useState("");
    const [auth] = useAuth();

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

    const open = Boolean(anchorEl);

    const handleOpenEditGroup = () => {
        handleClose();
        setOpenEditGroup(true)
    }

    const handleCloseEditGroup = () => {
        setOpenEditGroup(false);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseProfile = () => {
        setOpenProfile(false);
    }
    const handleOpenProfile = () => {
        setOpenProfile(true);
    }

    const handleLeaveGroup = async () => {
      try {
        const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/chats/remove-from-group`, {chatId: selectedChat._id, userId: auth.user._id});

        setFetchChatsAgain(!fetchChatsAgain);
        setSnack({
          ...snack,
          open: true,
          severity: "success",
          message: data.message
        })
      } catch (error) {
        console.log(error);
        setSnack({
          ...snack,
          open: true,
          severity: "error",
          message: "Something went wrong, try again!"
        })
      }
    }
    
  return (
    <>
      <Box
        p={2}
        width={"auto"}
        sx={{
          backgroundColor: "#F8FAFF",
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack
          alignItems={"center"}
          direction={"row"}
          sx={{ width: "100%", height: "100%" }}
          justifyContent="space-between"
        >
          <Stack
            
            spacing={2}
            direction="row"
            alignItems="center"
          >
            <IconButton onClick={() => setSelectedChat(null)}  sx={{display: {md: "none", lg: "none"}}}>
              <CaretLeft />
            </IconButton>
            
            <Box onClick={handleOpenProfile}>
              <Avatar src={pic ? URL.createObjectURL(pic) : ""} />
            </Box>
            <Typography variant="subtitle2">{getName(selectedChat, auth).slice(0, 20)}</Typography>
          </Stack>
          {selectedChat.isGroupChat ? 
          <div>
              <IconButton 
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              >
              <DotsThreeVertical size={32} />
          </IconButton >
              <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
              'aria-labelledby': 'basic-button',
              }}
              >
              <MenuItem onClick={handleOpenEditGroup}>Edit Group</MenuItem>
              <MenuItem onClick={handleLeaveGroup}>Leave Group</MenuItem>
          </Menu>
          </div>
          : <></>}
          
        </Stack>
      </Box>
      {openProfile && <ProfileDialog open={openProfile} handleClose={handleCloseProfile} />}
      {openEditGroup && <EditGroupDialog open={openEditGroup} handleClose={handleCloseEditGroup} /> }
    </>
  )
}

export default Header