import React from 'react'
import { Stack, Typography } from '@mui/material'
import ResetPasswordForm from '../../components/Forms/ResetPasswordForm'

const ResetPassword = () => {
  return (
    <Stack spacing={2} sx={{mb: 5, position: "relative"}}>
    <Typography variant="h4">Reset Password</Typography>
    <Stack direction="row" alignItems="center">
      <Typography variant="body2">
        Set new Password
      </Typography>
    </Stack>
    <ResetPasswordForm/>
</Stack>
  )
}

export default ResetPassword