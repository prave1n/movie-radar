import React, { useEffect, useState, useCallback, useRef } from "react";
import MovieCard from "./MovieCard";
//import WatchList from "./WatchList";
import SearchBar from "./SearchBar";
import { Form } from "react-bootstrap";
import NavBar from "./NavBar";
import Pagination from "./Pagination";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const updateSearch = (name) => {
    setSearch(name);
    resetState();
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreId)
        ? prevGenres.filter((id) => id !== genreId)
        : [...prevGenres, genreId]
    );
    resetState();
  };

  const handleYearRangeChange = (rangeId) => {
    setSelectedYearRanges((prevRanges) =>
      prevRanges.includes(rangeId)
        ? prevRanges.filter((id) => id !== rangeId)
        : [...prevRanges, rangeId]
    );
    resetState();
  };

  const contentStartRef = useRef(null);

  const scrollToContentStart = () => {
    if (contentStartRef.current) {
      contentStartRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    scrollToContentStart();
  };

  const resetState = () => {
    setPage(1);
    //setMovies([]);
    scrollToContentStart();
  };

  const fetchMovies = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    let url = `https://movie-radar-2.onrender.com/movie?page=${page}&limit=20`;
    const params = new URLSearchParams();

    if (selectedGenres.length > 0) {
      params.append("genres", selectedGenres.join(","));
    }

    if (selectedYearRanges.length > 0) {
      const yearRangesData = selectedYearRanges.map((id) => {
        const range = yearRanges.find((range) => range.id.toString() === id);
        return { start: range.start, end: range.end };
      });
      params.append("yearRanges", JSON.stringify(yearRangesData));
    }

    if (search) {
      params.append("search", search);
    }

    url += "&" + params.toString();

    fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": true,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setMovies(res.movies);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      });
  }, [isLoading, selectedGenres, selectedYearRanges, search, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <h1 style={{ marginTop: "50px", textAlign: "center", fontSize: "48px" }}>
        Movie List
      </h1>
      <span style={{ display: "block", textAlign: "center", fontSize: "14px" }}>
        (Credits: Movie data taken from themoviedb)
      </span>
      <div
        ref={contentStartRef}
        className="search-genre-container"
        style={{ margin: "20px auto" }}
      >
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
          {movies.map((movie) => (
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
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
      >
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Home;
