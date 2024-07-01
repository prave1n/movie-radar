import React from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

function Otp() {
  const [otp, setOtp] = useState("");
  const [psw, setPsw] = useState("");
  const [cfmpsw, setCfmpsw] = useState("");
  const [correctOtp, setcorrectOtp] = useState(true);

  const id = useParams().id;
  const otpHandler = (e) => {
    e.preventDefault();
    try {
      fetch("https://movie-radar-2.onrender.com/checkOtp", {
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
            setcorrectOtp(false);
          } else {
            alert(res.message);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const pswHandler = (e) => {
    e.preventDefault();
    if (psw === cfmpsw) {
      try {
        fetch("https://movie-radar-2.onrender.com/changepsw", {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": true,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            password: psw,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            alert(res.message);
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div>
      <div className="formparent" style={{ display: correctOtp ? "" : "none" }}>
        <div className="otpform">
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
          </Form>
        </div>
      </div>
      <div style={{ display: correctOtp ? "none" : "" }}>
        <div className="formparent">
          <div className="pswform">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Enter your new password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setPsw(e.target.value);
                  }}
                  style={{ width: "300px" }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCfmpassword">
                <Form.Label>Confirm your new password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Reenter your new password"
                  onChange={(e) => {
                    setCfmpsw(e.target.value);
                  }}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                onClick={(e) => {
                  pswHandler(e);
                }}
                style={{ width: "300px" }}
              >
                Change Password
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;
