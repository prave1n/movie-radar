import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePlayLists } from "../store/userSlice";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addmovie } from "../store/userSlice";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

function MovieCard({ movie }) {
  const id = useSelector((state) => state.user.userid);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let watchlist = useSelector((state) => state.user.watchlist);
  const playLists = useSelector((state) => state.user.playLists);
  const [checker, setChecker] = useState(playLists);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setAnchorEl(null);
  };

  const [movieAdd, setmovieAdd] = React.useState({
    show: false,
    vertical: "top",
    horizontal: "right",
  });
  // eslint-disable-next-line
  const { show, vertical, horizontal } = movieAdd;

  const addmovieAlert = (newState) => {
    setmovieAdd({
      show: true,
      vertical: "top",
      horizontal: "right",
    });
  };

  const addmovieClose = (event) => {
    event.preventDefault();
    setmovieAdd({
      show: false,
      vertical: "top",
      horizontal: "right",
    });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/movie/${movie.dbid}/average-rating`
        );
        const data = await response.json();
        setAverageRating(data.averageRating);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchAverageRating();
  }, [movie.dbid]);

  const addMovieHandler = async (e) => {
    let mov = [...watchlist, movie];
    e.preventDefault();
    await fetch("http://localhost:8080/addmovie", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        movie: mov,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        dispatch(addmovie({ movie: movie }));
        addmovieAlert();
      });
  };

  const jumpToPlay = async (e) => {
    e.preventDefault();
    setAnchorEl(null);
    navigate("/watchlist");
  };

  const addToPlayList = async (e, playListID) => {
    e.preventDefault();
    if (
      checker
        .filter((x) => x._id === playListID)[0]
        .movies.filter((y) => y === movie._id).length !== 0
    ) {
      alert("This movie is already part of the playlist");
    } else {
      try {
        await fetch("http://localhost:8080/addToPlayList", {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": true,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playListID: playListID,
            movieID: movie._id,
            userID: id,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            addmovieAlert();
            dispatch(updatePlayLists(res.user.playLists));
            setChecker(res.user.playLists);
            setAnchorEl(null);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <Card sx={{ maxWidth: 200, position: "relative" }}>
      <Snackbar
        open={movieAdd.show}
        autoHideDuration={6000}
        onClose={addmovieClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={addmovieClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Movie Added Successfully
        </Alert>
      </Snackbar>

      <CardActionArea>
        <Link
          to={`/movie/${movie.dbid}`}
          style={{ color: "white", textDecoration: "none" }}
        >
          <CardMedia
            component="img"
            image={movie.picture}
            alt="Image Not Found"
            sx={{ height: 300 }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 5,
              left: 5,
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              variant="determinate"
              value={averageRating !== null ? averageRating * 20 : 0}
              size={40}
              thickness={4}
              sx={{
                color: "green",
                position: "absolute",
              }}
            />
            <Typography
              variant="caption"
              component="div"
              color="white"
              sx={{ fontWeight: "bold" }}
            >
              {averageRating !== null
                ? `${Math.round(averageRating * 20)}%`
                : "NR"}
            </Typography>
          </Box>
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
        </Link>
      </CardActionArea>

      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
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
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "rgba(0,0,0,0.9)",
          },
        }}
        PaperProps={{
          style: {
            maxHeight: 200,
            width: "35ch",
          },
        }}
      >
        <MenuItem key="add-to-watchlist" onClick={addMovieHandler}>
          <Typography
            component="h1"
            variant="body1"
            sx={{ fontSize: "15px", color: "white" }}
          >
            <AddIcon sx={{ fontSize: "20px" }} /> Add to Watchlist
          </Typography>
        </MenuItem>
        <Divider sx={{ bgcolor: "text.primary" }} />
        <MenuItem key="view-watchlist" onClick={jumpToPlay}>
          <Typography
            component="h1"
            variant="body1"
            sx={{ fontSize: "15px", color: "white" }}
          >
            View My PlayLists
          </Typography>
        </MenuItem>
        <Divider sx={{ bgcolor: "text" }} />
        <MenuItem
          key="close-menu"
          onClick={handleClose}
          disabled={true}
          sx={{ fontSize: "15px", color: "white" }}
        >
          Select a PlayList to add the movie <ArrowDownwardIcon />
        </MenuItem>
        {playLists.map((option) => (
          <MenuItem
            sx={{ fontSize: "15px", color: "white" }}
            key={option.name}
            onClick={(e) => addToPlayList(e, option._id)}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
}

export default MovieCard;
