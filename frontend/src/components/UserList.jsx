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
          })
        } catch (err) {
          console.log(err)
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])

  
  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column"}}>
      <h1>Users</h1>
      <div style={{border:"1px solid black", height:"650px", overflow:"scroll", borderRadius:"20px"}}>
        {userList.map((user) => {
            return(
            <div key={user._id}>
            <UserCard
             user = {user}
            />
          </div>)
        })}
    </div>

    
    </div>
  )
}

export default FriendsList