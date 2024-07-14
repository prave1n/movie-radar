import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "./MovieCard";
import NavBar from "./NavBar";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GenreSelectorPopup from "./GenreSelectorPopup";
import "./styles/MyHome.css";

function MyHome() {
  const [moviesByGenre, setMoviesByGenre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenrePopup, setShowGenrePopup] = useState(false);
  const userId = useSelector((state) => state.user.userid);

  const fetchMovies = useCallback(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/myhome?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setMoviesByGenre(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      });
  }, [userId]);

  const fetchUserDetails = useCallback(() => {
    fetch(`http://localhost:8080/get-preferred-genres?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.preferredGenres.length === 0) {
          setShowGenrePopup(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  useEffect(() => {
    fetchMovies();
    fetchUserDetails();
  }, [fetchMovies, fetchUserDetails]);

  const handleSaveGenres = (selectedGenres) => {
    fetch("http://localhost:8080/update-preferred-genres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        preferredGenres: selectedGenres,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setShowGenrePopup(false);
          fetchMovies();
        } else {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
      })
      .catch((error) => {
        console.error("Error updating preferred genres:", error.message);
      });
  };

  return (
    <div>
      <NavBar />
      <h1 style={{ marginTop: "50px", textAlign: "center", fontSize: "48px" }}>
        Recommended Movies
      </h1>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Link to="/home">
          <Button>View All Movies</Button>
        </Link>
      </div>
      {isLoading ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>Loading...</div>
      ) : (
        moviesByGenre.map((genreSection) => (
          <div key={genreSection.genre} style={{ margin: "20px 0" }}>
            <h2>{genreSection.genre}</h2>
            <div className="scroll-container">
              {genreSection.movies.map((movie) => (
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
        ))
      )}
      <GenreSelectorPopup
        show={showGenrePopup}
        onHide={() => setShowGenrePopup(false)}
        onSave={handleSaveGenres}
      />
    </div>
  );
}

export default MyHome;

/* import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "./MovieCard";
import NavBar from "./NavBar";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles/MyHome.css";

function MyHome() {
  const [moviesByGenre, setMoviesByGenre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state) => state.user.userid);

  const fetchMovies = useCallback(() => {
    setIsLoading(true);
    const user = userId;
    fetch(`http://localhost:8080/myhome?userId=${user}`)
      .then((res) => res.json())
      .then((data) => {
        setMoviesByGenre(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div>
      <NavBar />
      <h1 style={{ marginTop: "50px", textAlign: "center", fontSize: "48px" }}>
        Recommended Movies
      </h1>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Link to="/home">
          <Button>View All Movies</Button>
        </Link>
      </div>
      {isLoading ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>Loading...</div>
      ) : (
        moviesByGenre.map((genreSection) => (
          <div key={genreSection.genre} style={{ margin: "20px 0" }}>
            <h2>{genreSection.genre}</h2>
            <div className="scroll-container">
              {genreSection.movies.map((movie) => (
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
        ))
      )}
    </div>
  );
}

export default MyHome;
 */
