import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { useState } from "react";

function UserCard({ user, pending }) {
  const [button, setButton] = useState();
  const thisEmail = useSelector((state) => state.user.email);
  const thisId = useSelector((state) => state.user.userid);
  const friendList = useSelector((state) => state.user.friendList);

  console.log(pending);
  const addFriendHandler = (e) => {
    try {
      fetch(`http://localhost:8080/fReq/${thisId}`, {
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
          console.log(res);
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
        <Button variant="dark" disabled>
          {" "}
          This is You{" "}
        </Button>
      );
    } else if (
      pending.filter((req) => req.recipient === user._id).length !== 0
    ) {
      setButton(
        <Button variant="dark" disabled>
          {" "}
          Request Sent{" "}
        </Button>
      );
    } else if (friendList.filter((x) => x === user._id).length !== 0) {
      setButton(
        <Button variant="dark" disabled>
          {" "}
          Friend{" "}
        </Button>
      );
    } else {
      setButton(
        <Button variant="primary" onClick={addFriendHandler}>
          {" "}
          Add Friend
        </Button>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>
            {user.fname} {user.lname}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Online Status?{" "}
          </Card.Subtitle>
          {button}
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserCard;
