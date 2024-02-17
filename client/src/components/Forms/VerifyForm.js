import React from 'react'
import {  useForm } from 'react-hook-form';
import RHFCodes from '../From-Fields/RHFCodes';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnack } from '../../Context/SnackBar';
import { useAuth } from '../../Context/auth';

const VerifyForm = () => {
    // const [otp, setOtp] = useState([]);
    const params = useParams();
    const [snack, setSnack] = useSnack();
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const verifySchema = Yup.object().shape({
        code2: Yup.string().required(),
        code3: Yup.string().required(),
        code1: Yup.string().required(),
        code4: Yup.string().required(),
        code5: Yup.string().required(),
        code6: Yup.string().required(),
    })
    const defaultValues= {
        code1: "",
        code2: "",
        code3: "",
        code4: "",
        code5: "",
        code6: "",
    }


    const {handleSubmit, control} = useForm({
        mode: "onChange",
        resolver: yupResolver(verifySchema),
        defaultValues
    });
    
    const onSubmit = async ({code1, code2, code3, code4, code5, code6}) => {
        
        try {
            const otp = `${code1}${code2}${code3}${code4}${code5}${code6}`
            const email = params.email;
            const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/verify-otp`, {email, otp});
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
    }

  return (
    <>
      <Stack
      noValidate
      spacing={2}
      component="form"
      sx={{ width: "100%", mt: "2rem" }}
      onSubmit={handleSubmit(onSubmit)}
      
    >
        <Stack direction="row" justifyContent="center" spacing={2}>
            <RHFCodes control={control} otp={["code1", "code2", "code3", "code4", "code5", "code6"]} />
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
        Verify
      </Button>
      </Stack>
    </>
  )
}

export default VerifyForm