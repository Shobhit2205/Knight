import { Alert, Snackbar } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useSnack } from "./Context/SnackBar";
import AppLayout from "./Layout/AppLayout";
import AuthLayout from "./Layout/AuthLayout";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import ResetPassword from "./Pages/auth/ResetPassword";
import VerifyOTP from "./Pages/auth/VerifyOTP";

function App() {
  const [snack, setSnack] = useSnack();

  const vertical = "bottom";
  const horizontal = "center";

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack({
      open: false,
      severity: null,
      message: null,
    });
  };
  return (
    <div className="App">
      <Routes>
        <Route path="/auth/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-otp/:email" element={<VerifyOTP />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/" element={<AppLayout/>} />
      </Routes>

      {snack.open && snack.message ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
          open={true}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={snack.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
