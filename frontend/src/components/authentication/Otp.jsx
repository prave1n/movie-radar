import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import {setPopUp} from '../../store/popupSlice';
import { useDispatch } from "react-redux";
import AlertBox from "../AlertBox";

function Otp() {
  const dispatch = useDispatch();
  const defaultTheme = createTheme();
  const [otp, setOtp] = useState("");
  const [psw, setPsw] = useState("");
  const [cfmpsw, setCfmpsw] = useState("");
  const [correctOtp, setcorrectOtp] = useState(true);
  const navigate = useNavigate();

  const id = useParams().id;
  const otpHandler = (e) => {
    e.preventDefault();
    try {
      fetch("https://movie-radar-1.onrender.com/checkOtp", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          otp: otp,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.result) {
            dispatch(setPopUp({variant:"success", message:res.message}))
            setcorrectOtp(false);
          } else {
            dispatch(setPopUp({variant:"error", message:res.message}))
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const pswHandler = (e) => {
    e.preventDefault();
    if (psw === cfmpsw) {
      try {
        fetch("https://movie-radar-1.onrender.com/changepsw", {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": true,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            password: psw,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            dispatch(setPopUp({variant:"success", message:res.message}))
            navigate("/");
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatch(setPopUp({variant:"error", message:"Passwords do not match"}))
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url("https://img.freepik.com/free-vector/gradient-black-background-with-wavy-lines_23-2149146012.jpg?t=st=1721701937~exp=1721705537~hmac=5dd9bbda451d84f6a3392b952937515e0c6a3ef359c231df1a60d87fd705db2f&w=1380")',
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "left",
            position: "relative",
          }}
        />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <AlertBox/>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <Typography component="h1" variant="h3">
              Enter Your OTP{" "}
            </Typography>

            <Box
              component="form"
              noValidate
              sx={{ mt: 1, width: "525px", display: correctOtp ? "" : "none" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="OTP"
                placeholder="Enter your OTP"
                label="OTP"
                name="OTP"
                autoFocus
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={otpHandler}
              >
                Check OTP
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="/" variant="body2">
                    Back to Login?
                  </Link>
                </Grid>

                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>

            <Box
              component="form"
              noValidate
              sx={{ mt: 1, width: "525px", display: correctOtp ? "none" : "" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                name="password"
                label="New Password"
                id="password"
                onChange={(e) => {
                  setPsw(e.target.value);
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                name="password"
                label="Confirm new Password"
                id="password"
                onChange={(e) => {
                  setCfmpsw(e.target.value);
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={pswHandler}
              >
                Change Password
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="/" variant="body2">
                    Back to Login?
                  </Link>
                </Grid>

                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Otp;

/* 

<div>
      <div className="formparent" style={{ display: correctOtp ? "" : "none" }}>
        <div className="sendemailform">
          <h2>Enter OTP</h2>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicOTP">
              <Form.Label>Enter your OTP: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your OTP"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                style={{ width: "300px" }}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                otpHandler(e);
              }}
              style={{ width: "300px" }}
            >
              Check OTP
            </Button>
          </Form>
        </div>
      </div>
      <div style={{ display: correctOtp ? "none" : "" }}>
        <div className="formparent">
          <div className="sendemailform">
            <h4>Passsword Reset</h4>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Enter your new password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setPsw(e.target.value);
                  }}
                  style={{ width: "300px" }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCfmpassword">
                <Form.Label>Confirm your new password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Reenter your new password"
                  onChange={(e) => {
                    setCfmpsw(e.target.value);
                  }}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                onClick={(e) => {
                  pswHandler(e);
                }}
                style={{ width: "300px" }}
              >
                Change Password
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>



*/
