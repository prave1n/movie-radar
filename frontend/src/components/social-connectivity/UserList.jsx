import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import UserCard from "./UserCard";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";

function FriendsList() {
  const [userList, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState("");
  const thisId = useSelector((state) => state.user.userid);

  const updateSearch = (name) => {
    setSearch(name);
  };

  useEffect(() => {
    try {
      fetch("http://localhost:8080/getUsers", {
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
          setUsers(res.users);
        });
    } catch (err) {
      console.log(err);
    }

    try {
      fetch(`http://localhost:8080/pendingReq/${thisId}`, {
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
          setPending(res.reqs);
        });
    } catch (err) {
      console.log(err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>Users</h1>
      <SearchBar setSearch={updateSearch} />
      {search && (
        <div
          style={{
            alignItems: "center",
            justifyContent: "space-evenly",
            display: "flex",
            flexWrap: "wrap",
            maxWidth: "1700px",
          }}
        >
          {userList
            .filter(
              (x) =>
                (x.fname + " " + x.lname)
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                x.username.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <UserCard key={user.id} user={user} pending={pending} />
            ))}
        </div>
      )}
    </div>
  );
}

export default FriendsList;
