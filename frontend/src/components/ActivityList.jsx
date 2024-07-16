import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react';
import NavBar from './NavBar';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';

function ActivityList() {
    const friendList = useSelector((state) => state.user.friendList)
    const [list,setList] = useState([])

    useEffect(() => {
        try {
          fetch(`https://movie-radar-2.onrender.com/getActivityList`, {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin": true,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                friendList: friendList,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              setList(res.list)
            });
        } catch (err) {
          console.log(err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

  return (
    <div>
      <NavBar/>
      <div style={{display:"flex" , flexDirection:"column", alignItems: "center", justifyContent:"center", padding:"20px", margin:"20px"}}>
        {list.map((str) => {
          return(
            <Card
          bg={"dark"}
          style={{ width: '75rem' }}
          text={'white'}
          className="mb-2"
        >
          <Card.Body>
            <Card.Text>
             {str}
            </Card.Text>
          </Card.Body>
        </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ActivityList