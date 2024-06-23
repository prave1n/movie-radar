import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function Reset() {
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
                      Click on this url to proceed: http://localhost:8080/forgotpsw/${res.id}
                      `,
              },
              "VkDdWcg4J7ipzkxpk" // PUBLIC KEY
            );
            console.log("send");
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
    <div className="formparent">
      <div className="sendemailform">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Enter your email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your registered email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ width: "300px" }}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            onClick={(e) => {
              emailHandler(e);
            }}
            style={{ width: "300px" }}
          >
            Send OTP
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Reset;
