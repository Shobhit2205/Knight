import React, { useEffect, useState } from 'react'
import { Avatar, IconButton, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import { X } from 'phosphor-react'
import { useChat } from '../Context/chat'
import { useSnack } from '../Context/SnackBar'

const GroupMembersElement = ({el}) => {
    const [snack, setSnack] = useSnack();
    const [selectedChat] = useChat();
    const [pic, setPic] = useState();

    const getPicture = async () => {      
        setPic("");
        if(!el) return;
        try {
          const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/user/get-picture/${el._id}`, {responseType: "blob"});
  
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
      }, [])



    const removeFromGroup = async () => {
        try {
            const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/chats/remove-from-group`, {chatId: selectedChat._id, userId: el._id});

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
    <>
    <Box
        p={2}
        sx={{
            borderRadius: 1,
            border: "1px solid rgba(0, 0, 0, 0.25)",
            backgroundColor: "#fcfcfc",
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={pic ? URL.createObjectURL(pic) : ""} alt={"image"} />
                    <Typography variant='subtitle2' fontSize={16}>{`${el.firstName} ${el.lastName}`}</Typography>
                </Stack>
                <IconButton onClick={removeFromGroup} >
                    <X size={32} />
                </IconButton>
            </Stack>
        </Box>
    </>
  )
}

export default GroupMembersElement