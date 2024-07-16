import React from "react";
import NavBar from "./NavBar";
import UserList from "./UserList";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendList";
//import ActivityList from './ActivityList'

export default function FriendsPage() {
  return (
    <div>
      <NavBar />
      <div
        style={{
          display: "flex",
          width: "90vw",
          justifyContent: "space-evenly",
          padding: "50px",
        }}
      >
        <div>
          <UserList />
        </div>
        <div>
          <FriendRequests />
        </div>
        <div>
          <FriendsList />
        </div>
      </div>
    </div>
  );
}
