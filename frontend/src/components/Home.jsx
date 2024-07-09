import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "./MovieCard";
import WatchList from "./WatchList";
import SearchBar from "./SearchBar";
import { Form } from "react-bootstrap";
import NavBar from "./NavBar";

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

const yearRanges = [
  { id: 1, name: "Before 1980", start: 0, end: 1979 },
  { id: 2, name: "1980-1989", start: 1980, end: 1989 },
  { id: 3, name: "1990-1999", start: 1990, end: 1999 },
  { id: 4, name: "2000-2009", start: 2000, end: 2009 },
  { id: 5, name: "2010-2019", start: 2010, end: 2019 },
  { id: 6, name: "2020 and later", start: 2020, end: 9999 },
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYearRanges, setSelectedYearRanges] = useState([]);

  const updateSearch = (name) => {
    setSearch(name);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreId)
        ? prevGenres.filter((id) => id !== genreId)
        : [...prevGenres, genreId]
    );
  };

  const handleYearRangeChange = (rangeId) => {
    setSelectedYearRanges((prevRanges) =>
      prevRanges.includes(rangeId)
        ? prevRanges.filter((id) => id !== rangeId)
        : [...prevRanges, rangeId]
    );
  };

  const fetchMovies = useCallback(() => {
    let url = "http://localhost:8080/movie?";
    const params = new URLSearchParams();

    if (selectedGenres.length > 0) {
      params.append("genres", selectedGenres.join(","));
    }
    if (selectedYearRanges.length > 0) {
      const yearRangesData = selectedYearRanges.map((id) =>
        yearRanges.find((range) => range.id.toString() === id)
      );
      params.append("yearRanges", JSON.stringify(yearRangesData));
    }

    url += params.toString();

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
  }, [selectedGenres, selectedYearRanges]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  //filter movies based on search and genres and release year intercals
  const filteredMovies = movies
    .slice(0, 300)
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        movie.overview.toLowerCase().includes(search.toLowerCase())
    )
    .filter((movie) =>
      selectedGenres.length > 0
        ? selectedGenres.some((genreId) =>
            movie.genre_ids.includes(parseInt(genreId))
          )
        : true
    )
    .filter((movie) => {
      if (selectedYearRanges.length === 0) return true;
      const movieYear = new Date(movie.release_date).getFullYear();
      return selectedYearRanges.some((rangeId) => {
        const range = yearRanges.find((r) => r.id.toString() === rangeId);
        return movieYear >= range.start && movieYear <= range.end;
      });
    });

  return (
    <div>
      <div>
        <NavBar/>
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
            Filter by Genres:
          </Form.Label>
          <div>
            {genres.map((genre) => (
              <Form.Check
                key={genre.id}
                type="checkbox"
                id={`genre-${genre.id}`}
                label={genre.name}
                checked={selectedGenres.includes(genre.id.toString())}
                onChange={() => handleGenreChange(genre.id.toString())}
                inline
              />
            ))}
          </div>
        </div>
        <div className="year-filter-container">
          <Form.Label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Filter by Release Years:
          </Form.Label>
          <div>
            {yearRanges.map((range) => (
              <Form.Check
                key={range.id}
                type="checkbox"
                id={`year-${range.id}`}
                label={range.name}
                checked={selectedYearRanges.includes(range.id.toString())}
                onChange={() => handleYearRangeChange(range.id.toString())}
                inline
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div className="d-flex flex-wrap">
          {filteredMovies.map((movie) => (
            <div key={movie._id}>
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
