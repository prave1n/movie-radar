import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addmovie } from "../store/userSlice";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const id = useSelector((state) => state.user.userid);
  const dispatch = useDispatch();

  let watchlist = useSelector((state) => state.user.watchlist);
  const addMovieHandler = async (e) => {
    let mov = [...watchlist, movie];
    e.preventDefault();
    await fetch("http://localhost:4000/addmovie", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        movie: mov,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        dispatch(addmovie({ movie: movie }));
        alert("Movie added successfully");
      });
  };
  return (
    <Card border="secondary" style={{ width: "18rem", margin: "5px" }}>
      <Card.Img variant="top" src={movie.picture} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text style={{ height: "12rem", overflow: "scroll" }}>
          {movie.overview}
        </Card.Text>
        <Button variant="primary" onClick={addMovieHandler}>
          Add to watchlist
        </Button>
        <Button variant="info">
          <Link
            to={`/movie/${movie.dbid}`}
            style={{ color: "white", textDecoration: "none" }}
          >
            See More
          </Link>
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;
