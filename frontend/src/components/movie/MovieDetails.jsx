import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Rating,
  Divider,
  List,
  ListItem,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import ReviewCard from "./ReviewCard";
import NavBar from "../sections/NavBar";
import AlertBox from "../AlertBox";

const theme = createTheme({
  palette: {
    primary: {
      main: "#032541",
    },
    secondary: {
      main: "#01b4e4",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0.0);
  const [reviewText, setReviewText] = useState("");
  const [averageRating, setAverageRating] = useState(null);
  const [error, setError] = useState(null);
  const email = useSelector((state) => state.user.email);
  const userId = useSelector((state) => state.user.userid);

  const fetchMovieDetails = useCallback(() => {
    fetch(`https://movie-radar-1.onrender.com/movie/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [id]);

  const fetchReviews = useCallback(() => {
    fetch(`https://movie-radar-1.onrender.com/reviews/${id}?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      });
  }, [id, userId]);

  const fetchAverageRating = useCallback(() => {
    fetch(`https://movie-radar-1.onrender.com/movie/${id}/average-rating`)
      .then((response) => response.json())
      .then((data) => {
        if (data.averageRating != null) {
          setAverageRating(data.averageRating.toFixed(2) + "/5");
        } else {
          setAverageRating("-/5");
        }
      })
      .catch((error) => {
        console.error("Error fetching average rating:", error);
        setAverageRating("-/5");
      });
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
    fetchAverageRating();
  }, [fetchMovieDetails, fetchReviews, fetchAverageRating]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating < 0.5 || rating > 5) {
      setError("Rating must be between 0.5 and 5.");
      return;
    }
    if (reviewText.trim() === "") {
      setError("Review text cannot be empty.");
      return;
    }
    setError(null);
    const payload = {
      user: email,
      movie: id,
      rating,
      reviewText,
    };
    try {
      const response = await fetch(
        `https://movie-radar-1.onrender.com/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      const newReview = await response.json();

      setReviews([newReview, ...reviews]);
      setRating(0);
      setReviewText("");
      fetchAverageRating();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `https://movie-radar-1.onrender.com/review/${reviewId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      setReviews(reviews.filter((review) => review._id !== reviewId));
      fetchAverageRating();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpvote = async (reviewId) => {
    const payload = { userId: email };
    //console.log("Upvoting review:", reviewId);
    //console.log(payload);

    try {
      const response = await fetch(
        `https://movie-radar-1.onrender.com/review/upvote/${reviewId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upvote review");
      }

      //const data = await response.json();
      //console.log("Upvote response:", data);

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
        `https://movie-radar-1.onrender.com/review/remove-upvote/${reviewId}`,
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

  /* const handleStarClick = (value) => {
    console.log("Star clicked with value:", value);
    if (value >= 0.5 && value <= 5) {
      setRating(value);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFullStar = rating >= i;
      const isHalfStar = rating >= i - 0.5 && rating < i;

      if (isFullStar) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={solidStar}
            onClick={() => handleStarClick(i)}
            style={{ cursor: "pointer", color: "gold" }}
          />
        );
      } else if (isHalfStar) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfAlt}
            onClick={() => handleStarClick(i - 0.5)}
            style={{ cursor: "pointer", color: "gold" }}
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={regularStar}
            onClick={() => handleStarClick(i)}
            style={{ cursor: "pointer", color: "gold" }}
          />
        );
      }
    }
    return stars;
  }; */

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <AlertBox/>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <img
                src={movie.picture}
                alt={movie.title}
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h3" gutterBottom>
                {movie.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.overview}
              </Typography>
              <Typography variant="subtitle1">
                Release Date: {movie.release_date}
              </Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <StarIcon color="secondary" />
                <Typography variant="h6" ml={1}>
                  Average Rating: {averageRating}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add a Review
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleReviewSubmit}>
            <Box mb={2}>
              <Typography component="legend">Your Rating</Typography>
              <Rating
                name="rating"
                value={rating}
                precision={0.5}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Your Review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit Review
            </Button>
          </form>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {reviews.length === 0 ? (
            <Alert severity="info">
              No reviews yet. If you have watched this movie, please add a
              review!
            </Alert>
          ) : (
            <List>
              {reviews.map((review) => (
                <ListItem key={review._id} disablePadding>
                  <Box width="100%" mb={2}>
                    <ReviewCard
                      review={review}
                      onUpvote={handleUpvote}
                      onRemoveUpvote={handleRemoveUpvote}
                      onDelete={() => handleDeleteReview(review._id)}
                      canDelete={review.user._id === userId}
                    />
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default MovieDetails;
