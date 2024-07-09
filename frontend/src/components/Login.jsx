import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Link from '@mui/material/Link';
import { useDispatch } from "react-redux";
import { newuser } from "../store/userSlice";
import "./styles/Login.css";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LocalMoviesRoundedIcon from '@mui/icons-material/LocalMoviesRounded';


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultTheme = createTheme();

  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");

  const submitHandler = async () => {
    try {
      await fetch("http://localhost:8080/login", {
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
          if (!res.login) {
            alert(res.message);
          } else {
            dispatch(newuser(res.user));
            console.log(res.token);
            localStorage.setItem("token", res.token);
            navigate(`/home`);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mainformbody">
      <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: "40px",
          }}
         
        >
          <Typography component="h1" variant="h3">
            Movie Radar  <LocalMoviesRoundedIcon sx={{ m: 1, fontSize: "54px"}}/>
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
        
        <Button type="submit" 
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={submitHandler}>
          Login
        </Button>

        <Grid container>
              <Grid item xs>
                <Link href="/signup" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/reset" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
        </Box>
        </Box>
        </Container>
    </ThemeProvider>
    </div>
    
  );
}
