import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendRequestCard from "./FriendRequestCard";

function FriendRequests() {
  const [fReqs, setFReqs] = useState([]);
  const thisId = useSelector((state) => state.user.userid);

  useEffect(() => {
    try {
      fetch(`http://localhost:8080/fReq/get/${thisId}`, {
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
  const count = fReqs.length === 0 ? <>No Pending Requests</> : <></>;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>Friend Requests</h1>
      <div
        style={{
          border: "1px solid black",
          height: "650px",
          overflow: "scroll",
          borderRadius: "20px",
          width: "20vw",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
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
