import React from 'react'
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResendVerfication from './ResendVerfication';

function Verify() {
    const id = useParams().id;
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const otpHandler = (e) => {
        e.preventDefault()
        try {
            fetch("https://movie-radar-2.onrender.com/verify", {
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
                  alert(res.message);
                  navigate('/')
                } else {
                    console.log(res.otp)
                  alert(res.message);
                }
              });
          } catch (err) {
            console.log(err);
          }
    }
  return (
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

            <ResendVerfication/>
          </Form>
        </div>
      </div>
  )
}

export default Verify