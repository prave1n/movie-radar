import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  List,
  ListItem,
  Chip,
  Alert,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import MovieIcon from "@mui/icons-material/Movie";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import RateReviewIcon from "@mui/icons-material/RateReview";

import UserReviewCard from "./UserReviewCard";
import MovieCard from "./MovieCard";
import NavBar from "./NavBar";
import GenreSelectorPopup from "./GenreSelectorPopup";
import PlayListsCard from "./PlayListsCard";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E50914",
    },
    secondary: {
      main: "#F5F5F1",
    },
    background: {
      default: "#141414",
      paper: "#1F1F1F",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B3B3B3",
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

const Profile = () => {
  const [user, setUser] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [preferredGenres, setPreferredGenres] = useState([]);
  const [showGenrePopup, setShowGenrePopup] = useState(false);
  const [error, setError] = useState(null);

  const userId = useSelector((state) => state.user.userid);
  const email = useSelector((state) => state.user.email);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/get-preferred-genres?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setPreferredGenres(data.preferredGenres))
      .catch((error) =>
        console.error("Error fetching preferred genres:", error)
      );

    fetch(`http://localhost:8080/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFname(data.fname);
        setLname(data.lname);
        setUsername(data.username);
      });

    fetch(`http://localhost:8080/watchlist/${userId}`)
      .then((res) => res.json())
      .then((data) => setWatchlist(data));

    fetch(`http://localhost:8080/user/reviews/${email}?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched reviews data:", data);
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Expected an array of reviews, received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user reviews:", error);
      });
  }, [userId, email]);

  const handleOpenGenrePopup = () => {
    setShowGenrePopup(true);
  };

  const handleSaveGenres = async (selectedGenres) => {
    try {
      const response = await fetch(
        "http://localhost:8080/update-preferred-genres",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, preferredGenres: selectedGenres }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update preferred genres");
      }

      setPreferredGenres(selectedGenres);
      setShowGenrePopup(false);
    } catch (error) {
      console.error("Error updating preferred genres:", error);
    }
  };

  const handleUpvote = async (reviewId) => {
    const payload = { userId: email };

    try {
      const response = await fetch(
        `http://localhost:8080/review/upvote/${reviewId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upvote review");
      }

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, upvotes: review.upvotes + 1, isUpvoted: true }
            : review
        )
      );
    } catch (error) {
      console.error("Error upvoting review:", error);
    }
  };

  const handleRemoveUpvote = async (reviewId) => {
    const payload = { userId: email };

    try {
      const response = await fetch(
        `http://localhost:8080/review/remove-upvote/${reviewId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove upvote from review");
      }

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, upvotes: review.upvotes - 1, isUpvoted: false }
            : review
        )
      );
    } catch (error) {
      console.error("Error removing upvote from review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/review/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const updatedUser = { fname, lname, username };
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user information");
      }

      const updatedUserData = await response.json();
      setUser(updatedUserData);
      setIsEditing(false);
    } catch (error) {
      console.error("error updating profile:", error);
      setError(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Profile
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h5">Personal Info</Typography>
                {!isEditing ? (
                  <IconButton onClick={handleEditClick} color="primary">
                    <EditIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleSaveClick} color="primary">
                    <SaveIcon />
                  </IconButton>
                )}
              </Box>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="First Name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    margin="normal"
                  />
                </>
              ) : (
                <>
                  <Typography>
                    <strong>Username:</strong> {user.username}
                  </Typography>
                  <Typography>
                    <strong>First Name:</strong> {user.fname}
                  </Typography>
                  <Typography>
                    <strong>Last Name:</strong> {user.lname}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </>
              )}
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Preferred Genres
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {preferredGenres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} color="primary" />
                ))}
              </Box>
              <Button
                variant="outlined"
                onClick={handleOpenGenrePopup}
                startIcon={<EditIcon />}
              >
                Edit Preferred Genres
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                <MovieIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Your Watchlist
              </Typography>
              <Grid container spacing={2}>
                {watchlist.slice(0, 4).map((movie) => (
                  <Grid item xs={6} sm={4} md={3} key={movie._id}>
                    <MovieCard movie={movie} />
                  </Grid>
                ))}
              </Grid>
              {watchlist.length > 4 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/watchlist")}
                  sx={{ mt: 2 }}
                >
                  See all Movies in Watchlist
                </Button>
              )}
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                <PlaylistPlayIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Your Playlists
              </Typography>
              <List>
                {user.playLists &&
                  user.playLists.slice(0, 3).map((playlist) => (
                    <ListItem key={playlist._id}>
                      <PlayListsCard list={playlist} />
                    </ListItem>
                  ))}
              </List>
              {user.playLists && user.playLists.length > 3 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/watchlist")}
                  sx={{ mt: 2 }}
                >
                  View All Playlists
                </Button>
              )}
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                <RateReviewIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Your Reviews
              </Typography>
              <List sx={{ width: "100%" }}>
                {reviews.slice(0, 3).map((review) => (
                  <ListItem key={review._id} sx={{ px: 0, py: 2 }}>
                    <Paper
                      elevation={2}
                      sx={{
                        width: "100%",
                        p: 2,
                        backgroundColor: "background.paper",
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <UserReviewCard
                        review={review}
                        onUpvote={handleUpvote}
                        onRemoveUpvote={handleRemoveUpvote}
                        canDelete={true}
                        onDelete={() => handleDeleteReview(review._id)}
                      />
                    </Paper>
                  </ListItem>
                ))}
              </List>
              {reviews.length > 3 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/user-reviews")}
                  sx={{ mt: 2 }}
                >
                  View All Reviews
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <GenreSelectorPopup
        show={showGenrePopup}
        onHide={() => setShowGenrePopup(false)}
        onSave={handleSaveGenres}
        initialGenres={preferredGenres}
      />
    </ThemeProvider>
  );
};

export default Profile;
