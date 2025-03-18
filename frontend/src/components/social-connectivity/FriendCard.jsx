import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeFriend } from "../../store/userSlice";
import { Link } from "react-router-dom";
import { Typography, Avatar, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

function FriendCard({ userId }) {
  const dispatch = useDispatch();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [pfp, setPfp] = useState("");
  const [hide] = useState(false);
  const thisId = useSelector((state) => state.user.userid);

  useEffect(() => {
    try {
      fetch(`https://movie-radar-1-qk2b.onrender.com/getUserDetails`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setFname(res.user.fname);
          setLname(res.user.lname);
          setUsername(res.user.username);
          setPfp(res.user.pfp);
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteFriendHandler = (e) => {
    e.preventDefault();
    try {
      fetch(`https://movie-radar-1-qk2b.onrender.com/friend/delete/${thisId}`, {
        method: "DELETE",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
          dispatch(
            removeFriend(res.friendList.filter((user) => user !== userId))
          );
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
              color="error"
              onClick={deleteFriendHandler}
            >
              Remove Friend
            </Button>
            <Link
              to={`/user/${username}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="contained" sx={{ mt: 3, mb: 2 }}>
                View Profile
              </Button>
            </Link>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}

export default FriendCard;

/* 
 <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>
              <Link
                to={`/user/${username}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {username}
              </Link>
            </Card.Title>
            <Card.Text>
              {fname} {lname}
            </Card.Text>
          </Card.Body>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button variant="outline-danger" onClick={deleteFriendHandler}>
              Remove Friend
            </Button>
          </div>
        </Card>
*/
