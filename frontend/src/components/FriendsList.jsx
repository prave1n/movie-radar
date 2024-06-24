import React from 'react'
import { useEffect} from 'react';
import { useState } from 'react';
import UserCard from './UserCard';


function FriendsList() {
    const [userList, setUsers] = useState([])

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
            setUsers(res.users)
            console.log(userList)
          })
        } catch (err) {
          console.log(err)
        } 
      },[]) 
  return (
    <div>
        {userList.map((user) => {
            return(
            <div key={user._id}>
            <UserCard
             user = {user}
            />
          </div>)
        })}
    </div>
  )
}

export default FriendsList