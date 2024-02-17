import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dialog, DialogContent, DialogTitle, Slide, Stack, TextField, Badge, IconButton } from '@mui/material'
import { useAuth } from '../../Context/auth';
import { useSnack } from '../../Context/SnackBar';
import * as Yup from "yup"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFTextField } from '../From-Fields/RHFTextField';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Camera } from 'phosphor-react';

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

const EditProfileForm = ({handleClose}) => {
  const [auth, setAuth] = useAuth();
  const [snack, setSnack] = useSnack();
  const [pic, setPic] = useState();

  const NewGroupSchema = Yup.object().shape({
      firstName: Yup.string().required("Name is Required"),
      lastName: Yup.string().required("Name is Required"),
  });

  const defaultValues = {
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
  }

  const {handleSubmit, control, formState: {errors}} = useForm({
      resolver: yupResolver(NewGroupSchema),
      defaultValues,
  })

  const getPicture = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/user/get-picture/${auth?.user?._id}`, {responseType: "blob"});

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
  }, [auth])

  const submitPicture = async () => {
    if(!pic) return;
    try {
      const picture = new FormData();
      pic && picture.append("picture", pic);
      const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/user/upload-picture`, picture);

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

      const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/user/remove-picture`);

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

  const onSubmit = async ({firstName, lastName}) => {
      try {
          
          const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/user/update-user-info`, {firstName : firstName, lastName: lastName});

          const newInfo = {
            loggedIn: auth.loggedIn,
            user: data.user,
            token: auth.token
          }
          setAuth(newInfo);

          localStorage.removeItem("auth");
          const info = JSON.stringify(newInfo);
          localStorage.setItem("auth", info);
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
              message: "user not updated"
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
          <RHFTextField control={control} errors={errors.firstName} name="firstName" label="First Name" />
          <RHFTextField control={control} errors={errors.lastName} name="lastName" label="Last Name" />
          <TextField disabled={true} name="email" label="Email" value={auth.user.email}></TextField>
          

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
                  Submit
              </Button>
          </Stack>
      </Stack>
  )
}

const EditProfileDialog = ({open, handleClose}) => {
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
      <DialogTitle >{"Profile"}</DialogTitle>
      <DialogContent>
        <EditProfileForm handleClose={handleClose}/>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog