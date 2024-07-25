import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./styles/Reset.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from '@mui/material/Paper';
import Link from "@mui/material/Link";

function Reset() {
  const defaultTheme = createTheme();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const emailHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(email);
      await fetch("http://localhost:8080/sendemail", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.email) {
            alert(res.message);
            // SEND EMAIL
            emailjs.send(
              "service_vwt5hn4", //service ID
              "template_qxyvfa6", //Template ID
              {
                email: res.useremail,
                username: res.username,
                message: `
                      Your OTP IS ${res.OTP}
                      Click on this url to proceed: https://movie-radar-6491.vercel.app/forgotpsw/${res.id}
                      `,
              },
              "VkDdWcg4J7ipzkxpk" // PUBLIC KEY
            );
            navigate(`/forgotpsw/${res.id}`);
          } else {
            alert(res.message);
          }
        });
    } catch (err) {
      console.log("failed");
      console.log(err);
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
        <Grid container component="reset" sx={{ height: '100vh' }}>
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
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'left',
              position:"relative"
          }}
        />
       
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
            <Typography component="h1" variant="h4">
              Reset Password {" "}
            </Typography>

            <Box component="form" noValidate sx={{ mt: 1, width:"525px" }}>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                placeholder="Enter Email"
                label="Email Address"
                name="email"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={emailHandler}
              >
                Send OTP
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="/" variant="body2">
                    Back to Login
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

export default Reset;


