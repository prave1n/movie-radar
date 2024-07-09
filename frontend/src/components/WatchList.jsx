import React from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./styles/WatchList.css";
import { useDispatch } from "react-redux";
import { removemovie } from "../store/userSlice";

function WatchList() {
  const watchlist = useSelector((state) => state.user.watchlist);
  const fname = useSelector((state) => state.user.fname);
  const id = useSelector((state) => state.user.userid);

  const dispatch = useDispatch();
  const deleteHandler = async (e, movie) => {
    e.preventDefault();
    // Do fetch req

    try {
      await fetch("http://localhost:8080/deleteMovie", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          movie: watchlist.filter((x) => x._id !== movie._id),
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res.message);
          
          dispatch(removemovie(watchlist.filter((x) => x._id !== movie._id)));
          console.log(watchlist)
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h1 style={{ marginTop: "40px" }}>{fname}'s WatchList</h1>
      <div
        class="d-flex scroll"
        style={{ marginTop: "10px", width: "1500px", overflowX: "scroll" }}
      > {watchlist.length === 0 ? <div style={{width:"1500px", height:"300px", display:"flex", alignItems:"center", justifyContent:"center"}}>Search and Add Movies</div> : <></> }
        {watchlist.map((movie) => {
          return (
            <Card
              key={movie._id}
              border="secondary"
              style={{
                maxWidth: "18rem",
                minWidth: "18rem",
                margin: "5px",
                border: "2px solid black",
              }}
            >
              <Card.Img variant="top" src={movie.picture} />
              <Card.Body>
                <Card.Title>{movie.name}</Card.Title>
                <Button
                  variant="danger"
                  onClick={(e) => deleteHandler(e, movie)}
                >
                  Delete from watchlist
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default WatchList;
