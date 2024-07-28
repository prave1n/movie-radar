import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResendVerfication from "./ResendVerfication";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import AlertBox from "../AlertBox";
import {setPopUp} from '../../store/popupSlice';
import { useDispatch } from "react-redux";

function Verify() {
  const defaultTheme = createTheme();
  const id = useParams().id;
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const otpHandler = (e) => {
    e.preventDefault();
    try {
      fetch("http://localhost:8080/verify", {
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
            navigate("/");
          } else {
            dispatch(setPopUp({variant:"error", message:res.message}))
          }
        });
    } catch (err) {
      console.log(err);
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
              Email Verification{" "}
              <LocalMoviesRoundedIcon sx={{ m: 0, fontSize: "54px" }} />
            </Typography>

            <Box component="form" noValidate sx={{ mt: 1, width: "525px" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="OTP"
                placeholder="Enter Verification OTP"
                label="Enter OTP"
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
                Verify Email
              </Button>
              <ResendVerfication />
              <Grid container>
                <Grid item xs>
                  <Link href="/reset" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>

                <Grid item>
                  <Link href="/" variant="body2">
                    {"Already have an account? Login"}
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

export default Verify;

/*
<div>
      <div className="sendemailform">
        <h2>Check your email for verification OTP</h2>
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

          <ResendVerfication />
        </Form>
      </div>
    </div>

*/
