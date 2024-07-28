import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Card from "react-bootstrap/Card";
import { useState } from "react";

function ActivityList() {
  const friendList = useSelector((state) => state.user.friendList);
  const [list, setList] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://movie-radar-1.onrender.com/getActivityList`,
          {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin": true,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              friendList: friendList,
            }),
          }
        );
        const result = await response.json();
        setList(result.list);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    if (friendList.length > 0) {
      fetchData();
    } else {
      setError(true);
    }
  }, [friendList]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          margin: "20px",
        }}
      >
        {error || friendList.length === 0 || list.length === 0 ? (
          <p>No recent activities found</p>
        ) : (
          list.map((str, index) => (
            <Card
              key={index}
              bg={"dark"}
              style={{ width: "75rem" }}
              text={"white"}
              className="mb-2"
              role="article"
            >
              <Card.Body>
                <Card.Text>{str}</Card.Text>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default ActivityList;
