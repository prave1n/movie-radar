import React from "react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeFriend } from "../store/userSlice";

function FriendCard({ userId }) {
  const dispatch = useDispatch();
  const [fname, setfname] = useState("");
  const [lname, setLname] = useState("");
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
          setfname(res.fname);
          setLname(res.user.lname);
          console.log(res.fname);
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
              {fname} {lname}
            </Card.Title>
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
