import React from 'react'
import { IconButton, Link, Stack, Typography } from '@mui/material'
import { ArrowLeft } from 'phosphor-react';
import {Link as RouterLink, useParams} from "react-router-dom";
import VerifyForm from '../../components/Forms/VerifyForm';

const VerifyOTP = () => {
    const params = useParams();
    
  return (
    <>
        <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4" paragraph>
          Please verify OTP
        </Typography>
        <Stack direction="row" alignItems="center">
            <IconButton sx={{mt: 0.5}}>
                <Link component={RouterLink} to="/auth/register" ><ArrowLeft/></Link>   
            </IconButton>
          <Typography variant="body2">
            Send to the mail <b>{params.email}</b>
          </Typography>
          
        </Stack>
        <Typography variant="body2" color="red">
            If not recieved then please also check in your spam folder
          </Typography>
        <VerifyForm/>
      </Stack>
    </>
  )
}

export default VerifyOTP