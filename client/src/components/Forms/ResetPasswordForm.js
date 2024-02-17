import React, {useState} from 'react'
import { Button, IconButton, InputAdornment, Stack } from "@mui/material";
import { Eye, EyeClosed } from "phosphor-react";
import { RHFTextField } from "../From-Fields/RHFTextField";
import axios from "axios";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { useSnack } from '../../Context/SnackBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../Context/auth';

const ResetPasswordForm = () => {
  const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [snack, setSnack] = useSnack();
    const [auth, setAuth] = useAuth();
    const [queryParams] = useSearchParams();

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    }

    const ResetPasswordSchema = Yup.object().shape({
        password: Yup.string().required("Password is required"),
        confirmPassword: Yup.string().required("Confirm Password is Required").oneOf([Yup.ref("password"), null], "Password must match")
    })

    const defaultValues = {
        password: "",
        confirmPassword: ""
    }

    const {handleSubmit, control, formState: {errors}} = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues,
    })

    const onSubmit = async ({password}) => {
        try {
          const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/reset-password`, {password, resetToken: queryParams.get("token")});

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
            severity: data?.status,
            message: data.message
        })
        navigate("/");

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
        errors={errors.confirmPassword}
        name="password"
        label="Password"
        type="password"   
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
                // onMouseDown={handleMouseDownPassword}
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
        Reset Password
      </Button>
    </Stack>
  )
}

export default ResetPasswordForm