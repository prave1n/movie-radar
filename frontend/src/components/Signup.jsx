import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Signup.css";
import Button from "react-bootstrap/Button";

function Signup() {
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [uName, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [pfp, setPfp] = useState("");

  //let result = true;
  const pswchecker = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );

  const submitHandler = async () => {
    let result = true;
    try {
      if (fname.trim() === "" || lname.trim() === "") {
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
        await fetch("http://localhost:8080/signIn", {
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
            console.log(res);
            navigate("/");
            alert("Account Creater Successfully. Please log in");
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div class="mainbody">
      <h1 class="movieTitle"> Movie Radar </h1>
      <div class="signinbody">
        <label>UserName: </label>
        <input
          type="text"
          placeholder="Enter your preffered username"
          name="username"
          required
          onChange={(e) => {
            setUname(e.target.value);
          }}
        />
        <br></br>

        <label>First Name: </label>
        <input
          type="text"
          placeholder="Enter your first name"
          name="fname"
          required
          onChange={(e) => {
            setFname(e.target.value);
          }}
        />
        <br></br>

        <label>Last Name: </label>
        <input
          type="text"
          placeholder="Enter your last name"
          name="lname"
          required
          onChange={(e) => {
            setLname(e.target.value);
          }}
        />
        <br></br>

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

        <label>Profile picture: </label>
        <input
          type="text"
          placeholder="Enter an url for your profile picture"
          name="pfp"
          required
          onChange={(e) => {
            setPfp(e.target.value);
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
          Sign Up
        </Button>
      </div>
    </div>
  );
}

export default Signup;
