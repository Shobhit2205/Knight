import React from 'react'
import { IconButton, Link, Stack, Typography } from '@mui/material'
import {Link as RouterLink} from "react-router-dom";
import { ArrowLeft } from 'phosphor-react';
import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <>
    <Stack spacing={2} sx={{mb: 5, position: "relative"}}>
        <Typography variant="h4">Forgot Password</Typography>
        <Stack direction="row" alignItems="center">
            <IconButton sx={{mt: 0.5}}>
                <Link component={RouterLink} to="/auth/login" ><ArrowLeft/></Link>   
            </IconButton>
          <Typography variant="body2">
            Enter email address linked to your account
          </Typography>
        </Stack>
        <ForgotPasswordForm/>
    </Stack>
    </>
  )
}

export default ForgotPassword