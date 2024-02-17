import React, { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { RHFTextField } from '../From-Fields/RHFTextField'
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSnack } from '../../Context/SnackBar';

const ForgotPasswordForm = () => {
    const [snack, setSnack] = useSnack();
    const [sent, setSent] = useState(false);

    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string().required("Email is required").email("Email must be valid")
    })

    const defaultValues = {
        email : ""
    }

    const {handleSubmit, control, formState: {errors}} = useForm({
        resolver: yupResolver(ForgotPasswordSchema),
        defaultValues
    })

    const onSubmit = async ({email}) => {
        try {
            const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {email});

            if(data.status === "success"){
                setSent(true);
            }
        } catch (error) {
            console.log(error);
            setSnack({
                ...snack,
                open: true,
                severity: "error",
                message: error?.response?.data?.message
            })
        }
    }
  return (
    <Stack
    noValidate
    spacing={2}
    component="form"
    sx={{ width: "100%", mt: "2rem" }}
    onSubmit={handleSubmit(onSubmit)}
  >
      <RHFTextField
        control={control}
        errors={errors.email}
        name="email"
        label="Email"
      />

      {sent && 
      <Stack>
        <Typography variant='body2' color="green">Reset Link sent to your Email</Typography>
        <Typography variant='body2' color="red">If not recieved Please also check in your spam folder</Typography>
      </Stack>}
      
      <Button
        variant="contained"
        fullWidth
        type="submit"
        sx={{
          height: "50px",
          backgroundColor: "#332f2f",
          "&:hover": {
            backgroundColor: "black",
          },
        }}
      >
        Submit
      </Button>
  </Stack>
  )
}

export default ForgotPasswordForm