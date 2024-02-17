import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Stack, Typography } from "@mui/material";
import LoginForm from "../../components/Forms/LoginForm";

const Login = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Login to Knight</Typography>
        <Stack spacing={0.5} direction="row">
          <Typography variant="body2">New User?</Typography>
          <Link to="/auth/register" component={RouterLink} variant="subtitle2">
            Create an account
          </Link>
        </Stack>
        <LoginForm />
      </Stack>
    </>
  );
};

export default Login;
