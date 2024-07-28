import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendRequestCard from "./FriendRequestCard";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import WarningIcon from "@mui/icons-material/Warning";

function FriendRequests() {
  const [fReqs, setFReqs] = useState([]);
  const thisId = useSelector((state) => state.user.userid);

  useEffect(() => {
    try {
      fetch(`https://movie-radar-2.onrender.com/fReq/get/${thisId}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setFReqs(res.fReq);
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const count =
    fReqs.length === 0 ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 165, 0, 0.1)", // Light orange background
          padding: 2,
          borderRadius: 1,
          m: 2,
          border: "1px solid rgba(255, 165, 0, 0.5)", // Border color
        }}
      >
        <WarningIcon sx={{ color: "orange", mr: 1 }} />
        <Typography
          variant="body1"
          sx={{ color: "orange", fontWeight: "bold" }}
        >
          No Pending Friend Requests
        </Typography>
      </Box>
    ) : (
      <></>
    );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3">Friend Requests</Typography>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          maxWidth: "1500px",
        }}
      >
        {fReqs.map((req) => {
          return (
            <FriendRequestCard
              key={req.sender}
              from={req.sender}
              createdAt={req.createdAt}
              id={req._id}
            />
          );
        })}
        {count}
      </div>
    </div>
  );
}

export default FriendRequests;
