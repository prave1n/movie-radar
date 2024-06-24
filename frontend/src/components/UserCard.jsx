import React from 'react'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useState } from 'react';

function UserCard({user}) {
    let button;
    const addFriendHandler = (e) => {
        console.log(user)
    }

    // Check if this person is already a friend or if its the user themselves :) ** 
    if(true) {
        button = <Button variant="primary" onClick={addFriendHandler}> Add Friend</Button>;
    }

    
  return (
    <Card style={{ width: '18rem' }}>
    <Card.Body>
      <Card.Title>{user.fname} {user.lname}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">Online Status? </Card.Subtitle>
    
      {button}
    </Card.Body>
  </Card>
  )
}

export default UserCard