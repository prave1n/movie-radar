import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "./MovieCard";
import WatchList from "./WatchList";
import SearchBar from "./SearchBar";
import { Form } from "react-bootstrap";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const updateSearch = (name) => {
    setSearch(name);
  };

  //updated fetchMovies to handle filter by genre
  const fetchMovies = useCallback(() => {
    let url = "https://movie-radar-2.onrender.com/movie";
    if (selectedGenre) {
      url += `?genre=${selectedGenre}`;
    }
    fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": true,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setMovies(res))
      .catch((error) => console.error("Error fetching movies:", error));
  }, [selectedGenre]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  //filter movies based on search and genre
  const filteredMovies = movies
    .slice(0, 300)
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        movie.overview.toLowerCase().includes(search.toLowerCase())
    )
    .filter((movie) =>
      selectedGenre ? movie.genre_ids.includes(parseInt(selectedGenre)) : true
    );

  return (
    <div>
      <div>
        <WatchList />
      </div>
      <h1 style={{ marginTop: "50px", textAlign: "center", fontSize: "48px" }}>
        Movie List
      </h1>
      <span style={{ display: "block", textAlign: "center", fontSize: "14px" }}>
        (Credits: Movie data taken from themoviedb)
      </span>
      <div className="search-genre-container" style={{ margin: "20px auto" }}>
        <SearchBar setSearch={updateSearch} />
        <div className="genre-filter-container">
          <Form.Label
            htmlFor="genre-select"
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Filter by Genre:
          </Form.Label>
          <Form.Control
            id="genre-select"
            as="select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{ width: "200px" }}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </Form.Control>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div className="d-flex flex-wrap">
          {filteredMovies.map((movie) => (
            <div key={movie.id}>
              <MovieCard
                movie={movie}
                title={movie.title}
                overview={movie.overview}
                picture={movie.picture}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
