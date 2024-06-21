import React, { useEffect } from "react";
import NavBar from "./NavBar";
import MovieCard from "./MovieCard";
import { useState } from "react";
import WatchList from "./WatchList";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const updateSearch = (name) => {
    setSearch(name);
  };

  useEffect(() => {
    fetch("http://localhost:8080/movie", {
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
        setMovies(res);
      });
  }, []);

  return (
    <div>
      <NavBar />
      <div>
        <Button onClick={() => navigate("/profile")}>View Profile</Button>
      </div>
      <div>
        <WatchList />
      </div>
      <h1
        style={{
          marginTop: "50px",
          width: "1500px",
          display: "flex",
          justifyContent: "center",
          fontSize: "72px",
        }}
      >
        {" "}
        Movie List
      </h1>
      <span
        style={{
          marginTop: "0px",
          width: "1500px",
          display: "flex",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        (Credits: Movie data taken from themoviedb)
      </span>
      <SearchBar setSearch={updateSearch} />
      <div>
        <div
          class="d-flex flex-wrap"
          style={{ marginTop: "10px", width: "1500px" }}
        >
          {movies
            .slice(0, 999)
            .filter(
              (x) => x.title.includes(search) || x.overview.includes(search)
            )
            .map((movie) => {
              return (
                <div key={movie.id}>
                  <MovieCard
                    movie={movie}
                    title={movie.title}
                    overview={movie.overview}
                    picture={movie.picture}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Home;
