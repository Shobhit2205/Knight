import React, { useEffect } from "react";
import { Container, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../assets/pngegg.png";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authuser = localStorage.getItem("auth");
  
    if(authuser){
        navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <>
      <Container sx={{ pt: 8, height: "100vh" }} maxWidth="sm" >
        <Stack spacing={5} sx={{mb: 2}}>
          <Stack
            sx={{ width: "100%", mb: 2 }}
            alignItems="center"
            justifyContent="center"
          >
            <img style={{ height: 120, width: 120, borderRadius: "10px" }} src={Logo} alt="Logo" />
          </Stack>
        </Stack>
        <Outlet />
      </Container>
    </>
  );
};

export default AuthLayout;
