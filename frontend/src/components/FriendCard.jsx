import React from "react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeFriend } from "../store/userSlice";
import { Link } from "react-router-dom";

function FriendCard({ userId }) {
  const dispatch = useDispatch();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [hide, setHide] = useState(false);
  const thisId = useSelector((state) => state.user.userid);

  useEffect(() => {
    try {
      fetch(`http://localhost:8080/getUserDetails`, {
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
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteFriendHandler = (e) => {
    e.preventDefault();
    try {
      fetch(`http://localhost:8080/friend/delete/${thisId}`, {
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
          dispatch(
            removeFriend(res.friendList.filter((user) => user !== userId))
          );
          setHide(true);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: hide ? "none" : "" }}>
      <div style={{ margin: "20px" }}>
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
      </div>
    </div>
  );
}

export default FriendCard;
