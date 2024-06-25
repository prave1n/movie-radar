import React from 'react'
import Card from "react-bootstrap/Card";
import { useState } from 'react';
import { useEffect } from 'react';
import Button from "react-bootstrap/Button";
import { addFriend } from '../store/userSlice';
import { useDispatch } from 'react-redux';

function FriendRequestCard({from, createdAt, id}) {
    const dispatch = useDispatch()
    const [fname, setfname] = useState("sss")
    const [lname, setLname] = useState("sss")
    const [hide, setHide] = useState(false)
    useEffect(() => {
        try {
          fetch(`http://localhost:8080/getUserDetails`, {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin": true,
              "Content-Type": "application/json",
            },  body: JSON.stringify({
                id: from,
              }),
          })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            setfname(res.user.fname)
            setLname(res.user.lname)
            console.log(res)
          })
        } catch (err) {
          console.log(err)
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])

      const deleteRequestHandler = (e) => {
            e.preventDefault()
            try {
                fetch(`http://localhost:8080/fReq/delete`, {
                  method: "DELETE",
                  headers: {
                    "Access-Control-Allow-Origin": true,
                    "Content-Type": "application/json",
                  },  body: JSON.stringify({
                      id: id,
                    }),
                })
                .then((res) => {
                  return res.json();
                })
                .then((res) => {
                  console.log(res)
                  setHide(true)
                })
              } catch (err) {
                console.log(err)
              } 
      }

      const acceptRequestHandler = (e) => {
        e.preventDefault()
        try {
            fetch(`http://localhost:8080/acceptReq`, {
              method: "POST",
              headers: {
                "Access-Control-Allow-Origin": true,
                "Content-Type": "application/json",
              },  body: JSON.stringify({
                id: id,
              }),
            })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              console.log(from)
              dispatch(addFriend({friendList: from}));
              setHide(true)

            })
          } catch (err) {
            console.log(err)
          } 
  }

  return (
    <div style={{display: hide ? "none" : ""}}>
    <div style={{margin:"20px"}}>
      <Card style={{ width: '18rem'}}>
            <Card.Body>
            <Card.Title>{fname} {lname}</Card.Title>
            <Card.Subtitle>Sent at: {createdAt}</Card.Subtitle>
            </Card.Body>
            <div style={{display:"flex", justifyContent:"space-around"}}>
            <Button variant="outline-success" onClick={acceptRequestHandler} >
                    Accept
            </Button>
            <Button variant="outline-danger" onClick={deleteRequestHandler}>
                    Deny
            </Button>
            </div>
        </Card>
     
        </div>
    </div>
  )
}

export default FriendRequestCard