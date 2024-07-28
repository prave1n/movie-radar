import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import Chip from "@mui/material/Chip";
import PublicIcon from "@mui/icons-material/Public";
import SecurityIcon from "@mui/icons-material/Security";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

function PublicPlayListsCard({ list }) {
  const [movies, setMovies] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    try {
      fetch("https://movie-radar-2.onrender.com/getMovieList", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list: list.movies,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setMovies(res.movieList);
        });
    } catch (err) {
      console.log(err);
    }
  }, [list.movies]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedMovies = showAll ? movies : movies.slice(0, 5);

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          {list.name}{" "}
          <Chip
            variant="filled"
            color="primary"
            label={list.public ? "Public" : "Private"}
            icon={list.public ? <PublicIcon /> : <SecurityIcon />}
            size="small"
          />
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
        {list.description}
      </Typography>
      <Grid container spacing={2}>
        {displayedMovies.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1">Playlist is Empty</Typography>
          </Grid>
        ) : (
          displayedMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={2.4} key={movie._id}>
              <Card sx={{ position: "relative", height: "100%" }}>
                <CardActionArea component={Link} to={`/movie/${movie.dbid}`}>
                  <CardMedia
                    component="img"
                    image={movie.picture}
                    alt={movie.title}
                    sx={{
                      width: "100%",
                      height: "auto",
                      aspectRatio: "2 / 3",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "8px",
                      backgroundColor: "rgba(0,0,0,0.7)",
                    }}
                  >
                    <Typography variant="body2" color="white">
                      {movie.title}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      {movies.length > 5 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            onClick={toggleShowAll}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            {showAll ? "Show Less" : "See All"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default PublicPlayListsCard;
