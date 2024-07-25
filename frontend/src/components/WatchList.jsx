import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removemovie } from "../store/userSlice";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

function WatchList() {
  const watchlist = useSelector((state) => state.user.watchlist);
  const id = useSelector((state) => state.user.userid);
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);

  const deleteHandler = async (e, movie) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/deleteMovie", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          movie: watchlist.filter((x) => x._id !== movie._id),
        }),
      });
      const data = await response.json();
      console.log(data.message);
      dispatch(removemovie(watchlist.filter((x) => x._id !== movie._id)));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedMovies = showAll ? watchlist : watchlist.slice(0, 5);

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Your WatchList
      </Typography>
      <Grid container spacing={2}>
        {watchlist.length === 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">Search and Add Movies</Typography>
            </Box>
          </Grid>
        ) : (
          displayedMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={2.4} key={movie._id}>
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
                <IconButton
                  aria-label="delete"
                  onClick={(e) => deleteHandler(e, movie)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      {watchlist.length > 5 && (
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
    </Container>
  );
}

export default WatchList;
