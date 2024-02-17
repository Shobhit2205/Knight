import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFTextField } from '../From-Fields/RHFTextField';
import RHFAutoComplete from '../From-Fields/RHFAutoComplete';
import { useAuth } from '../../Context/auth';
import { useSnack } from '../../Context/SnackBar';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupForm = ({handleClose}) => {
    const [auth] = useAuth();
    const [snack, setSnack] = useSnack();
    const [userChats, setUserChats] = useState([]);

    const NewGroupSchema = Yup.object().shape({
        title: Yup.string().required("Group Name is Required"),
        members: Yup.array().min(2, "Must have atleast 2 members")
    });

    const defaultValues = {
        title: "",
        members: [],
    }

    const {handleSubmit, control, setValue, formState: {errors}} = useForm({
        resolver: yupResolver(NewGroupSchema),
        defaultValues,
    })

    const getUserChats = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/chats/fetch-chats`);
            const users = data.filter((el) => !el.isGroupChat)

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

    const onSubmit = async ({title, members}) => {
        try {
            const user = members.map((el, ind) => el.users[0]._id === auth.user._id ? el.users[1]._id : el.users[0]._id)
            const users = JSON.stringify(user);
            const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/chats/create-group`, {name : title, users});
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
                message: "Group is not created"
            })
        }
    }

    return (
        <Stack
        noValidate
        spacing={2}
        component="form"
        sx={{ width: "100%", mt: "5px" }}
        onSubmit={handleSubmit(onSubmit)}
        >
            <RHFTextField control={control} errors={errors.title} name="title" label="Group Name" />
            <RHFAutoComplete control={control} options={userChats} errors={errors.members} name="members" label="Members" ChipProps={{ size: "medium" }} setValue={setValue}/>

            <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="end"
            >
                <Button type="submit" variant="contained" sx={{backgroundColor: "#0162C4"}} onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" sx={{backgroundColor: "#0162C4"}}>
                    Create
                </Button>
            </Stack>
        </Stack>
    )
}

const GroupDialog = ({open, handleClose}) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle >{"Create Group"}</DialogTitle>
      <DialogContent>
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}

export default GroupDialog