import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { addFriend } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { Typography, Avatar, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

function FriendRequestCard({ from, createdAt, id }) {
  const dispatch = useDispatch();
  const [fname, setfname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [pfp, setPfp] = useState("");
  const [hide, setHide] = useState(false);
  useEffect(() => {
    try {
      fetch(`https://movie-radar-1-qk2b.onrender.com/getUserDetails`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: from,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setfname(res.user.fname);
          setLname(res.user.lname);
          setUsername(res.user.username);
          setPfp(res.user.pfp);
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteRequestHandler = (e) => {
    e.preventDefault();
    try {
      fetch(`https://movie-radar-1-qk2b.onrender.com/fReq/delete`, {
        method: "DELETE",
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
          console.log(res);
          setHide(true);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const acceptRequestHandler = (e) => {
    e.preventDefault();
    try {
      fetch(`https://movie-radar-1-qk2b.onrender.com/acceptReq`, {
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
          console.log(from);
          dispatch(addFriend({ friendList: from }));
          setHide(true);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: hide ? "none" : "" }}>
      <div style={{ margin: "20px" }}>
        <Card sx={{ maxWidth: 475, minWidth: 475, padding: 1.5 }}>
          <CardContent>
            <Box display="flex" alignItems="center" my={3}>
              <Avatar
                src={pfp}
                alt={username}
                sx={{ width: 100, height: 100, mr: 3 }}
              />
              <Box>
                <Typography variant="h4">{username}</Typography>
                <Typography variant="subtitle1">{`${fname} ${lname}`}</Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              sx={{ mt: 3, mb: 2 }}
              variant="contained"
              onClick={acceptRequestHandler}
            >
              Accept
            </Button>

            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="error"
              onClick={deleteRequestHandler}
            >
              Deny
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}

export default FriendRequestCard;

/* 
  <div style={{ display: hide ? "none" : "" }}>
      <div style={{ margin: "20px" }}>
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>
              {fname} {lname}
            </Card.Title>
            <Card.Subtitle>Sent at: {createdAt}</Card.Subtitle>
          </Card.Body>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button variant="outline-success" onClick={acceptRequestHandler}>
              Accept
            </Button>
            <Button variant="outline-danger" onClick={deleteRequestHandler}>
              Deny
            </Button>
          </div>
        </Card>
      </div>
    </div>
*/
