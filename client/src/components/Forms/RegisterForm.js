import React, {useState} from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button, IconButton, InputAdornment, Stack } from "@mui/material";
import { Eye, EyeClosed } from "phosphor-react";
import { RHFTextField } from "../From-Fields/RHFTextField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnack } from "../../Context/SnackBar";

const RegisterForm = () => {
    const [snack, setSnack] = useSnack();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const LoginSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password"), null], "Password must match"),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, data);
      navigate(`/auth/verify-otp/${data.email}`);
    } catch (error) {
      console.log(error);
      setSnack({
        ...snack,
        open: true,
        severity: "error",
        message: error?.response?.data?.message
      })
    }
  };
  return (
    <Stack
      noValidate
      spacing={2}
      component="form"
      sx={{ width: "100%", mt: "2rem" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={2} direction={{ sm: "row", sx: "column" }}>
        <RHFTextField
          control={control}
          errors={errors.firstName}
          name="firstName"
          label="First Name"
        />
        <RHFTextField
          control={control}
          errors={errors.lastName}
          name="lastName"
          label="Last Name"
        />
      </Stack>
      <RHFTextField
        control={control}
        errors={errors.email}
        name="email"
        label="Email"
      />

      <RHFTextField
        control={control}
        errors={errors.password}
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        inputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? (
                  <Eye color="black" />
                ) : (
                  <EyeClosed color="black" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <RHFTextField
        control={control}
        errors={errors.confirmPassword}
        name="confirmPassword"
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        inputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? (
                  <Eye color="black" />
                ) : (
                  <EyeClosed color="black" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
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
        Sign Up
      </Button>
    </Stack>
  );
};

export default RegisterForm;
