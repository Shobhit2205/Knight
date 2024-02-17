import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { Camera, NotePencil } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../Context/auth';
import { useChat } from '../../Context/chat';
import { useSnack } from '../../Context/SnackBar';
import RHFAutoComplete from '../From-Fields/RHFAutoComplete';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import GroupMembersElement from '../GroupMembersElement';
import { styled } from '@mui/material/styles';
import { useFetchChat } from '../../Context/fetch';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


const CreateGroupForm = ({handleClose}) => {
    const [auth] = useAuth();
    const [snack, setSnack] = useSnack();
    const [userChats, setUserChats] = useState([]);
    const [selectedChat] = useChat();
    const [fetchChat, setFetchChat] = useFetchChat();
    const [canEdit, setCanEdit] = useState();
    const [groupName, setGroupName] = useState(selectedChat.chatName);

    const changeGroupName = async () => {
        try {
            const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/chats/rename-group`, {chatId: selectedChat._id, chatName: groupName});
            setCanEdit(!canEdit);
            setFetchChat(!fetchChat);
            setSnack({
                ...snack,
                open: true,
                severity: data?.status,
                message: data?.message
            })
        } catch (error) {
            console.log(error);
            setSnack({
                ...snack,
                open: true,
                severity: "error",
                message: error.response.data.message
            })
        }
    }

    const NewGroupSchema = Yup.object().shape({
        newMembers: Yup.array()
    });

    const defaultValues = {
        newMembers: [],
    }

    const {handleSubmit, control, setValue, formState: {errors}} = useForm({
        resolver: yupResolver(NewGroupSchema),
        defaultValues
    })
    

    const getUserChats = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/chats/fetch-chats`);
            const allusers = await data.filter((el) => !el.isGroupChat)
            var users = [];

            for(var i = 0; i < allusers.length; i++){
                const ind = allusers[i].users[0]._id === auth.user._id ? 1 : 0;
                var flag = true;
                for(var j = 0; j < selectedChat.users.length; j++){
                    if(allusers[i].users[ind]._id === selectedChat.users[j]._id){
                        flag = false;
                        break;
                    }
                }
                if(flag === true){
                    users.push(allusers[i]);
                }
            }

            setUserChats(users);
        } catch (error) {
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
      }, [auth?.token])


    const onSubmit = async ({newMembers}) => {
        try {
            const user = newMembers.map((el, ind) => el.users[0]._id === auth.user._id ? el.users[1]._id : el.users[0]._id)
            const users = JSON.stringify(user);
            const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/chats/add-to-group`, {chatId : selectedChat._id, users});

            handleClose();

            setSnack({
                ...snack,
                open: true,
                severity: data?.status,
                message: data?.message
            })
            
        } catch (error) {
            console.log(error);
            setSnack({
                ...snack,
                open: true,
                severity: "error",
                message: error.response.data.message
            })
        }
    }

    return (
        <Stack
        noValidate
        spacing={2}
        // component="form"
        sx={{ width: "100%", mt: "5px" }}
        >
            <TextField 
            fullWidth 
            defaultValue={selectedChat.chatName}
            disabled = {!canEdit}
            label="Group Name"
            sx={{mt: 2}}
            onKeyUp={(e) => setGroupName(e.target.value)}
            InputProps={{
                endAdornment: (
                    canEdit ? 
                    <>
                        <Button onClick={changeGroupName} >Save</Button>
                        <Button onClick={() => setCanEdit(!canEdit)} >Cancel</Button>
                    </>
                     : 
                    <IconButton onClick={() => setCanEdit(!canEdit)} >
                     <NotePencil color='black' size={32} />
                    </IconButton>
                ) 
            }}
             />

             <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
                <RHFAutoComplete control={control} options={userChats} errors={errors.newMembers} name="newMembers" label="Add Members" ChipProps={{ size: "medium" }} setValue={setValue}/>
                <Button type="submit" variant="contained" sx={{backgroundColor: "#0162C4"}}>
                    Add
                </Button>
             </Stack>


                <Typography>All Members</Typography>
            <Stack spacing={2} sx={{height: "150px", width:"100%", flexGrow: 1, overflowY: "scroll"}}>
                {selectedChat.users.map((el) => (
                    <GroupMembersElement el = {el}/>
                ))}
            </Stack>

            <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="end"
            >
                <Button type="submit" variant="contained" sx={{backgroundColor: "#0162C4"}} onClick={handleClose}>
                    Cancel
                </Button>
                
            </Stack>
        </Stack>
    )
}


const EditGroupDialog = ({open, handleClose}) => {
    const [pic, setPic] = useState();
    const [snack, setSnack] = useSnack();
    const [selectedChat] = useChat();
    const getGroupDP = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/chats/get-group-dp/${selectedChat._id}`, {responseType: "blob"});

            setPic(data);
        } catch (error) {
            console.log(error);
            setSnack({
                ...snack,
                open: true,
                severity: "error",
                message: "Can not get Picture"
            })
        }
    }

    useEffect(() => {
         getGroupDP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);

    const submitPicture = async () => {
        if(!pic) return;
        try {
        const picture = new FormData();
        pic && picture.append("groupDP", pic);
        picture.append("chatId", selectedChat._id);

        const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/chats/set-group-dp`, picture);

        handleClose();
        window.location.reload();
        setSnack({
            ...snack,
            open: true,
            severity: data?.status,
            message: data?.message
        })
        } catch (error) {
        console.log(error);
        setSnack({
            ...snack,
            open: true,
            severity: "error",
            message: "Picture not updated"
        })
        }
    }

    const removePicture = async () => {
        try {

          const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/chats/remove-group-dp`, {chatId: selectedChat._id});

          handleClose();
          window.location.reload();
          setSnack({
            ...snack,
            open: true,
            severity: data?.status,
            message: data?.message
          })
        } catch (error) {
          console.log(error);
          setSnack({
            ...snack,
            open: true,
            severity: "error",
            message: "Picture not Removed"
          })
        }
      }

  return (
    <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{display: "flex", alignItems: "center", justifyContent: "center"}} >
          <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{width: "100%"}}>
            
            <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          
          badgeContent={
            <IconButton component='label' sx={{"&:hover":{backgroundColor: "#fff"}}}>
              <Camera />
              <VisuallyHiddenInput type="file" onChange={(e) => setPic(e.target.files[0])} />
            </IconButton>
          }
          >
            <Avatar src={pic ? URL.createObjectURL(pic) : ""} sx={{width: "100px", height: "100px"}}/>
            </Badge>

            <Stack direction="row" spacing={2}>
            <Button variant="contained" sx={{backgroundColor: "#0162C4"}} onClick={submitPicture}>
              Save Image
            </Button>
            <Button variant="contained" sx={{backgroundColor: "#0162C4"}} onClick={removePicture}>
              Remove Image
            </Button>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>         
          <CreateGroupForm handleClose={handleClose} />
        </DialogContent>
      </Dialog>
  )
}

export default EditGroupDialog