import React from "react";
import { useSelector } from "react-redux";
import FriendCard from "./FriendCard";

function FriendList() {
  const friendList = useSelector((state) => state.user.friendList);
  let count = friendList.length === 0 ? <>No Friends :O</> : <></>;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>Friends</h1>
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
        {friendList.map((user) => {
          return <FriendCard userId={user} />;
        })}
        {count}
      </div>
    </div>
  );
}

export default FriendList;
