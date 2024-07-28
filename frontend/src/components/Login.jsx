import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { newuser } from "../store/userSlice";
import "./styles/Login.css";
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

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultTheme = createTheme();

  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://movie-radar-2.onrender.com/login", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: psw,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setLoading(false);
          if (!res.login) {
            alert(res.message);
          } else {
            dispatch(newuser(res.user));
            console.log(res.token);
            localStorage.setItem("token", res.token);
            navigate(`/myhome`);
          }
        });
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
                Login
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
