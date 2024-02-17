import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Stack, Typography } from "@mui/material";
import RegisterForm from "../../components/Forms/RegisterForm";

const Register = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Register to Knight</Typography>
        <Stack spacing={0.5} direction="row">
          <Typography variant="body2">Already have an account?</Typography>
          <Link to="/auth/login" component={RouterLink} variant="subtitle2">
            Login here
          </Link>
        </Stack>
        <RegisterForm />
      </Stack>
    </>
  );
};

export default Register;
