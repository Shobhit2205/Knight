import React, { useEffect, useState } from 'react'
import { Avatar, Box, IconButton, Menu, MenuItem, Skeleton, Stack, Typography } from '@mui/material'
import axios from 'axios';
import { MagnifyingGlass, Plus, SignOut, User, UserCirclePlus } from 'phosphor-react'
import { useAuth } from '../Context/auth';
import { useSnack } from '../Context/SnackBar';
import ChatElement from './ChatElement';
import GroupDialog from './Dialogs/GroupDialog';
import { Search, SearchIconWrapper, StyledInputBase } from './Search'
import SearchDialog from './Dialogs/SearchDialog';
import { useChat } from '../Context/chat'
import EditProfileDialog from './Dialogs/EditProfileDialog';
import { useNavigate } from 'react-router-dom';
import { useFetchChat } from '../Context/fetch';

const Chats = () => {
    const [snack, setSnack] = useSnack();
    const [auth, setAuth] = useAuth();
    const [userChats, setUserChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openGroupDialog, setOpenGroupDialog] = useState(false);
    const [selectedChat, setSelectedChat] = useChat();
    const [fetchChat] = useFetchChat();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [pic, setPic] = useState("");
    const navigate = useNavigate();

    const openProfile = Boolean(anchorEl);

    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false);
    }

    const handleCloseProfile = () => {
        setAnchorEl(null);
    };
    const handleClickProfile = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenGroupDialog = () => {
        setOpenGroupDialog(true);
    };
      
    const handleCloseGroupDialog = () => {
        setOpenGroupDialog(false);
    };

    const handleClick = (el) => {
        setSelectedChat(el);
    }

    const logoutUser = () => {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/auth/login");
    }

    const getPicture = async () => {
        if(!auth.user) return;
        try {
          const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/user/get-picture/${auth?.user?._id}`, {responseType: "blob"});
    
          setPic(res.data);
          
        } catch (error) {
          console.log(error);
          setSnack({
            ...snack,
            open: true,
            severity: "error",
            message: "can not get picture fedsx"
          })
        }
      }
    
      useEffect(() => {
        getPicture();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [auth])

    const getUserChats = async () => {
        setLoading(true);
        try {   
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/chats/fetch-chats`);
            setUserChats(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            setSnack({
                ...snack,
                open: true,
                severity: "error",
                message: "Unable to fetch Chats"
            })
        }
    }

      useEffect(() => { 
        if(auth?.token) getUserChats();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [auth?.token && fetchChat])

  return (
    <>
    <Box
    sx={{
      position: "relative",     
      backgroundColor: "#F8FAFF",
      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      display: {lg: "block", md: "block", xs: `${selectedChat ? "none" : "block"}`, sm : `${selectedChat ? "none" : "block"}`},
      flexGrow: 1, 
      height: "100%", 
      overflow: "scroll"
    }}
    >
        <Stack p={3} spacing={2} m="auto">
            <Stack direction="row" alignItems="center" justifyContent="space-between" >
                <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton 
                    id="basic-button"
                    aria-controls={openProfile ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openProfile ? 'true' : undefined}
                    onClick={handleClickProfile}
                >
                    <Avatar src={pic ? URL.createObjectURL(pic) : ""} />
                </IconButton >
                    <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openProfile}
                    onClose={handleCloseProfile}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                    >
                    <MenuItem>
                        <Stack sx={{width: 100}} direction="row" alignItems="center" justifyContent="space-between" onClick={() => setOpenProfileDialog(true)} >
                            Profile
                            <User/> 
                        </Stack>
                    </MenuItem>
                    <MenuItem onClick={logoutUser}>
                        <Stack sx={{width: 100}} direction="row" alignItems="center" justifyContent="space-between" >
                            LogOut
                            <SignOut/> 
                        </Stack>
                    </MenuItem>
                </Menu>
                    
                    <Typography variant='subtitle2' fontWeight={600} >{`${auth?.user?.firstName} ${auth?.user?.lastName}`}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={handleClickOpen}>
                        <UserCirclePlus size={32} />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack sx={{ width: "100%" }}>
                <Search>
                    <SearchIconWrapper>
                        <MagnifyingGlass color="#709CE6" />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search..."
                        inputProps={{ "aria-label": "Search" }}
                    />
                </Search>
            </Stack>

            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>Create New Group</Typography>
                    <IconButton onClick={handleOpenGroupDialog}>
                        <Plus/>
                    </IconButton>
                </Stack>
            </Stack>           
            
            <Stack spacing={2.4} width="100%">
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>All Chats</Typography>
                {loading ? 
                    <Stack spacing={2}> 
                        <Skeleton variant="rounded" width="100%" height={70} /> 
                        <Skeleton variant="rounded" width="100%" height={70} /> 
                        <Skeleton variant="rounded" width="100%" height={70} /> 
                        <Skeleton variant="rounded" width="100%" height={70} /> 
                        <Skeleton variant="rounded" width="100%" height={70} /> 
                        <Skeleton variant="rounded" width="100%" height={70} /> 
                    </Stack> :  userChats.map((el, ind) => (
                    <Stack key={ind} spacing={2} onClick={() => handleClick(el)}>
                        <ChatElement el={el} />
                    </Stack>
                ))}
            </Stack> 
        </Stack>
    </Box>
    {openDialog && <SearchDialog open={openDialog} handleClose={handleCloseDialog} />}
    {openGroupDialog && <GroupDialog open={openGroupDialog} handleClose={handleCloseGroupDialog} />}
    {openProfileDialog && <EditProfileDialog open={openProfileDialog} handleClose={handleCloseProfileDialog} />}
    </>
  )
}

export default Chats