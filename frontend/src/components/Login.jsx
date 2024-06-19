import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { newuser } from "../store/userSlice";
import "./styles/Login.css";
import Button from "react-bootstrap/esm/Button";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");

  const submitHandler = async () => {
    try {
      await fetch("http://localhost:5000/login", {
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
            alert("Login Credentials are incorrect");
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
    <div class="mainformbody">
      <h1 class="movieTitle">Movie Radar</h1>
      <div class="formbody">
        <label>Email: </label>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br></br>
        <label>Password: </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          required
          onChange={(e) => {
            setPsw(e.target.value);
          }}
        />
        <br></br>
        <Button type="submit" onClick={submitHandler}>
          Login
        </Button>

        <div>
          <p>
            Dont have an acount? <Link to="/signup">Sign Up</Link>
          </p>
          <br></br>
          <p>
            Forgot Password? <Link to="/reset">Reset Password</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
