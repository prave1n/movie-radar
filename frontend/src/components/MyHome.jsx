import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "./MovieCard";
import NavBar from "./NavBar";
import {
  Button,
  Typography,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
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
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ mt: 6, mb: 4 }}
        >
          Recommended Movies
        </Typography>
        <Box textAlign="center" mb={4}>
          <Button
            component={Link}
            to="/home"
            variant="contained"
            color="primary"
          >
            View All Movies
          </Button>
        </Box>
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          moviesByGenre.map((genreSection) => (
            <Box key={genreSection.genre} my={4}>
              <Typography variant="h4" gutterBottom>
                {genreSection.genre}
              </Typography>
              <Box className="scroll-container">
                {genreSection.movies.map((movie) => (
                  <Box key={movie._id} mx={1} sx={{ flex: "0 0 auto" }}>
                    <MovieCard
                      movie={movie}
                      title={movie.title}
                      overview={movie.overview}
                      picture={movie.picture}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        )}
      </Container>
      <GenreSelectorPopup
        show={showGenrePopup}
        onHide={() => setShowGenrePopup(false)}
        onSave={handleSaveGenres}
      />
    </Box>
  );
}

export default MyHome;
