import React from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import emailjs from "@emailjs/browser";

function ResendVerfication() {
  const id = useParams().id;
  const submitHandler = (e) => {
    e.preventDefault();
    try {
      fetch("https://movie-radar-2.onrender.com/resend", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.result) {
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
            alert(res.message);
          } else {
            alert(res.message);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="error"
      sx={{ mt: 0, mb: 2 }}
      onClick={submitHandler}
    >
      Resend OTP
    </Button>
  );
}

export default ResendVerfication;
