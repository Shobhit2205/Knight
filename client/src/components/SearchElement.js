import { Avatar, Button, IconButton, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { Chat } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { useSnack } from '../Context/SnackBar'

const SearchElement = ({el, open, handleClose}) => {
    const [snack, setSnack] = useSnack();
    const [pic, setPic] = useState();

    const getPicture = async (el) => {      
        setPic("");
        if(!el) return;
        try {
          const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/user/get-picture/${el._id}`, {responseType: "blob"});
    
          setPic(data);
          
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

    
    const createChat = async (userId) => {
        try {
          await axios.post(`${process.env.REACT_APP_API}/api/v1/chats/access-chats`, {userId});
          handleClose(!open);
          window.location.reload();
    
        } catch (error) {
          console.log(error);
          setSnack({
            ...snack,
            severity: "error",
            message: error?.response?.data?.message
          })
        }
    }
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={pic ? URL.createObjectURL(pic) : ""} alt="faker" />
            <Typography variant='subtitle2'>{`${el.firstName} ${el.lastName}`}</Typography>
        </Stack>
        <Button>
            <IconButton onClick={() => createChat(el._id)}>
                <Chat/>
            </IconButton>
        </Button>
    </Stack>
  )
}

export default SearchElement