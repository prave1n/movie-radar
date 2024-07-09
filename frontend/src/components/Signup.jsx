import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Signup.css";
import Button from "react-bootstrap/Button";
import emailjs from "@emailjs/browser";

function Signup() {
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [uName, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [pfp, setPfp] = useState("");
  const [tele, setTele] = useState("");

  //let result = true;
  const pswchecker = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );

  const submitHandler = async () => {
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
            telegram: tele
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            console.log(res);

            // SEND EMAIL
            if(res.result) {
              emailjs.send(
                "service_vwt5hn4", //service ID
                "template_qxyvfa6", //Template ID
                {
                  email: res.useremail,
                  username: res.username,
                  message: `
                        In order to verify your email, your OTP IS ${res.otp}
                        `,
                },
                "VkDdWcg4J7ipzkxpk" // PUBLIC KEY
              );
  
              alert("Account Created Successfully. Please verify your email before logging in");
              navigate(`/verify/${res.userId}`);
            } else {
              alert(res.message);
            }
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

        <label>Telegram Handle (Optional): </label>
        <input
        type="text"
        placeholder="Enter your telegram handle"
        name="pfp"
        required
        onChange={(e) => {
          setTele(e.target.value);
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
