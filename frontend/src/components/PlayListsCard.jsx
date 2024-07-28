import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updatePlayLists } from "../store/userSlice";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import PublicIcon from "@mui/icons-material/Public";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

function PlayListsCard({ list }) {
  const [movies, setMovies] = useState([]);
  const dispatch = useDispatch();
  const playLists = useSelector((state) => state.user.playLists);
  const id = useSelector((state) => state.user.userid);
  const [pub, setPublic] = useState(list.public);
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
          list: playLists.filter((x) => x._id === list._id)[0].movies,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setMovies(res.movieList);
        });
    } catch (err) {
      console.log(err);
    } // eslint-disable-next-line
  }, [playLists]);

  const delPlayList = (e) => {
    e.preventDefault();
    try {
      fetch("https://movie-radar-2.onrender.com/delPlayList", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: id,
          listID: list._id,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
          dispatch(updatePlayLists(res.user.playLists));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const delMovie = (e, movieID) => {
    e.preventDefault();
    try {
      fetch("https://movie-radar-2.onrender.com/delmoviePlayList", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: id,
          listID: list._id,
          movieID: movieID,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          alert(`Movie deleted from ${list.name}`);
          dispatch(updatePlayLists(res.user.playLists));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const changePrivacyHandler = (e) => {
    e.preventDefault();
    try {
      fetch("https://movie-radar-2.onrender.com/changePrivacy", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: id,
          listID: list._id,
          pub: pub,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          alert(`${list.name} changed to ${pub ? "Private" : "Public"}`);
          dispatch(updatePlayLists(res.playLists));
          setPublic(!pub);
        });
    } catch (err) {
      console.log(err);
    }
  };

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
            label={!pub ? "Private" : "Public"}
            icon={!pub ? <SecurityIcon /> : <PublicIcon />}
            size="small"
          />
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ mr: 1, textTransform: "none" }}
            onClick={delPlayList}
          >
            Delete Playlist
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={pub ? <SecurityIcon /> : <PublicIcon />}
            onClick={changePrivacyHandler}
            sx={{ textTransform: "none" }}
          >
            Make {pub ? "Private" : "Public"}
          </Button>
        </Box>
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
                <IconButton
                  aria-label="delete"
                  onClick={(e) => delMovie(e, movie._id)}
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

export default PlayListsCard;
