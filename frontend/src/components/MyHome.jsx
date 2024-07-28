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
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenrePopup, setShowGenrePopup] = useState(false);
  const userId = useSelector((state) => state.user.userid);

  const fetchMovies = useCallback(() => {
    setIsLoading(true);
    fetch(`https://movie-radar-2.onrender.com/myhome?userId=${userId}`)
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

  const fetchRecommendedMovies = useCallback(() => {
    fetch(
      `https://movie-radar-2.onrender.com/recommended-movies?userId=${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRecommendedMovies(data);
      })
      .catch((error) => {
        console.error("Error fetching recommended movies:", error);
      });
  }, [userId]);

  const fetchUserDetails = useCallback(() => {
    fetch(
      `https://movie-radar-2.onrender.com/get-preferred-genres?userId=${userId}`
    )
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
    fetchRecommendedMovies();
  }, [fetchMovies, fetchUserDetails, fetchRecommendedMovies]);

  const handleSaveGenres = (selectedGenres) => {
    fetch("https://movie-radar-2.onrender.com/update-preferred-genres", {
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
        {recommendedMovies.length > 0 ? (
          <Box my={4}>
            <Typography variant="h4" gutterBottom>
              Top Picks for You
            </Typography>
            <Box className="scroll-container">
              {recommendedMovies.map((movie) => (
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
        ) : (
          <Box my={4}>
            <Typography variant="h4" gutterBottom>
              Recommended Movies
            </Typography>
            <Typography variant="body1">
              Set your preferred genres or leave reviews on movies you have
              watched to see our recommended movies that we think you will like!
            </Typography>
          </Box>
        )}
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
