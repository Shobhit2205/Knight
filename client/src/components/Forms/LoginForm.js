import React from "react";
import * as Yup from "yup";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, IconButton, InputAdornment, Link, Stack } from "@mui/material";
import { Eye, EyeClosed } from "phosphor-react";
import { RHFTextField } from "../From-Fields/RHFTextField";
import { useSnack } from "../../Context/SnackBar";
import { useAuth } from "../../Context/auth";
import axios from "axios";

const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [snack, setSnack] = useSnack();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit = async ({email, password}) => {
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {email, password});
      const info = {
        loggedIn: true,
        user: data.user,
        token: data.token,
      }
      localStorage.setItem("auth", JSON.stringify(info));

      setAuth({
        ...auth,
        loggedIn: true,
        user: data.user,
        token: data.token
      });
            
      setSnack({
        ...snack,
        open: true,
        severity: "success",
        message: data.message
      })   

      navigate("/")
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
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          to="/auth/forgot-password"
          component={RouterLink}
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ cursor: "pointer" }}
        >
          Forgot password?
        </Link>
      </Stack>
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
        LogIn
      </Button>
    </Stack>
  );
};

export default LoginForm;
