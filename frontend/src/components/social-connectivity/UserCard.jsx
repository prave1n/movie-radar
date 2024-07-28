import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Typography, Avatar, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

function UserCard({ user, pending }) {
  const [button, setButton] = useState();
  const thisEmail = useSelector((state) => state.user.email);
  const thisId = useSelector((state) => state.user.userid);
  const friendList = useSelector((state) => state.user.friendList);

  const addFriendHandler = (e) => {
    try {
      fetch(`https://movie-radar-1.onrender.com/fReq/${thisId}`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: thisId,
          to: user._id,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setButton(
            <Button variant="dark" disabled>
              {" "}
              Request Sent{" "}
            </Button>
          );
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Check if this person is already a friend or if its the user themselves :) **

  useEffect(() => {
    if (user.email === thisEmail) {
      setButton(
        <Button
          variant="contained"
          disabled={true}
          sx={{
            opacity: 0.6,
            "&.Mui-disabled": {
              backgroundColor: "#1976d2",
              color: "#ffffff",
            },
          }}
        >
          {" "}
          This is You{" "}
        </Button>
      );
    } else if (
      pending.filter((req) => req.recipient === user._id).length !== 0
    ) {
      setButton(
        <Button
          variant="contained"
          disabled={true}
          sx={{
            opacity: 0.6,
            "&.Mui-disabled": {
              backgroundColor: "#1976d2",
              color: "#ffffff",
            },
          }}
        >
          {" "}
          Request Sent{" "}
        </Button>
      );
    } else if (friendList.filter((x) => x === user._id).length !== 0) {
      setButton(
        <Button
          variant="contained"
          disabled={true}
          sx={{
            opacity: 0.6,
            "&.Mui-disabled": {
              backgroundColor: "#1976d2",
              color: "#ffffff",
            },
          }}
        >
          {" "}
          Friend{" "}
        </Button>
      );
    } else {
      setButton(
        <Button variant="contained" color="success" onClick={addFriendHandler}>
          {" "}
          Add Friend
        </Button>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div style={{ margin: "20px" }}>
        <Card sx={{ maxWidth: 475, minWidth: 475, padding: 1.5 }}>
          <CardContent>
            <Box display="flex" alignItems="center" my={3}>
              <Avatar
                src={user.pfp}
                alt={user.username}
                sx={{ width: 100, height: 100, mr: 3 }}
              />
              <Box>
                <Typography variant="h4">{user.username}</Typography>
                <Typography variant="subtitle1">{`${user.fname} ${user.lname}`}</Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>{button}</CardActions>
        </Card>
      </div>
    </div>
  );
}

export default UserCard;

/*
<div style={{ margin: "20px" }}>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{user.username}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {user.fname} {user.lname}
          </Card.Subtitle>
          {button}
        </Card.Body>
      </Card>
    </div>

*/
