import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Signup.css";
import emailjs from "@emailjs/browser";
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
import CircularProgress from "@mui/material/CircularProgress";

function Signup() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [uName, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [pfp, setPfp] = useState("");
  const [loading, setLoading] = useState(false);

  //let result = true;
  const pswchecker = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result = true;
    try {
      if (fname.trim() === "" || lname.trim() === "" || uName.trim() === "") {
        alert("Please fill in all the fields to create an account");
        result = false;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email");
        result = false;
      }
      if (!pswchecker.test(psw)) {
        alert(
          "Password must have minimum eight characters, at least one captial letter,at least one captial letter, one number and one special character:"
        );
        result = false;
      }
      if (result) {
        await fetch("https://movie-radar-2.onrender.com/signIn", {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": true,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: fname,
            lastname: lname,
            username: uName,
            email: email,
            password: psw,
            pfp: pfp,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            setLoading(false);
            console.log(res);

            // SEND EMAIL
            if (res.result) {
              emailjs.send(
                "service_vwt5hn4", //service ID
                "template_qxyvfa6", //Template ID
                {
                  email: res.useremail,
                  username: res.username,
                  message: `
                        In order to verify your email, your OTP IS ${res.otp}. You can click on this link to enter your OTP http://localhost:3000/verify/${res.userId}.
                        `,
                },
                "VkDdWcg4J7ipzkxpk" // PUBLIC KEY
              );

              alert(
                "Account Created Successfully. Please verify your email before logging in"
              );
              navigate(`/verify/${res.userId}`);
            } else {
              alert(res.message);
            }
          });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
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
              Movie Radar{" "}
              <LocalMoviesRoundedIcon sx={{ m: 1, fontSize: "54px" }} />
            </Typography>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="name"
                name="username"
                label="Username"
                id="username"
                onChange={(e) => {
                  setUname(e.target.value);
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                type="name"
                name="fname"
                label="First Name"
                id="fname"
                onChange={(e) => {
                  setFname(e.target.value);
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                type="name"
                name="lname"
                label="Last Name"
                id="laname"
                onChange={(e) => {
                  setLname(e.target.value);
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                type="name"
                name="pfp"
                label="Profile Picture"
                id="pfp"
                onChange={(e) => {
                  setPfp(e.target.value);
                }}
              />

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

              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                name="password"
                label="Password"
                id="password"
                onChange={(e) => {
                  setPsw(e.target.value);
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={submitHandler}
                disabled={loading}
              >
                SIGN UP
              </Button>

              {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress />
                </Box>
              )}

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

export default Signup;
