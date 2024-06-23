import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ReviewCard from "./ReviewCard";
import NavBar from "./NavBar";
import "./styles/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [averageRating, setAverageRating] = useState(null);
  const email = useSelector((state) => state.user.email);
  const userId = useSelector((state) => state.user.userid);

  useEffect(() => {
    //fetch movie details
    fetch(`http://localhost:8080/movie/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));

    //fetch reviews
    fetch(`http://localhost:8080/reviews/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const sortedReviews = data.sort((a, b) => {
          if (b.upvotes !== a.upvotes) {
            return b.upvotes - a.upvotes;
          } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
        });
        setReviews(sortedReviews);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      });

    //fetch avg rating
    fetch(`http://localhost:8080/movie/${id}/average-rating`)
      .then((response) => response.json())
      .then((data) => {
        if (data.averageRating === null) {
          setAverageRating("-/5");
        } else {
          setAverageRating(data.averageRating.toFixed(2) + "/5");
        }
      })
      .catch((error) => {
        console.error("Error fetching average rating:", error);
        setAverageRating("-/5");
      });
  }, [id, email]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user: email,
      movie: id,
      rating,
      reviewText,
    };
    try {
      const response = await fetch(`http://localhost:8080/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      const newReview = await response.json();

      setReviews([newReview, ...reviews]);
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error adding review:", error);
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
            ? { ...review, upvotes: review.upvotes + 1 }
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
            ? { ...review, upvotes: review.upvotes - 1 }
            : review
        )
      );
    } catch (error) {
      console.error("Error removing upvote from review:", error);
    }
  };

  /* const handleUpvote = async (reviewId) => {
    const payload = { userId: email };

    await fetch(`http://localhost:8080/review/upvote/${reviewId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((updatedReview) => {
        if (updatedReview._id) {
          setReviews(
            reviews.map((review) =>
              review._id === updatedReview._id ? updatedReview : review
            )
          );
        } else {
          console.error("Failed to upvote review:", updatedReview);
        }
      })
      .catch((error) => console.error("Error upvoting review:", error));
  };

  const handleRemoveUpvote = async (reviewId) => {
    const payload = { userId: email };

    await fetch(`http://localhost:8080/review/remove-upvote/${reviewId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((updatedReview) => {
        if (updatedReview._id) {
          setReviews(
            reviews.map((review) =>
              review._id === updatedReview._id ? updatedReview : review
            )
          );
        } else {
          console.error("Failed to remove upvote from review:", updatedReview);
        }
      })
      .catch((error) =>
        console.error("Error removing upvote from review:", error)
      );
  }; */

  return (
    <div>
      <NavBar />
      <div className="movie-details-container">
        <Button onClick={() => navigate(-1)} className="mb-3">
          Back
        </Button>

        <div className="movie-header">
          <img src={movie.picture} alt={movie.title} className="movie-image" />
          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-overview">{movie.overview}</p>
            <p>Release Date: {movie.release_date}</p>
            <p className="movie-rating">Average Rating: {averageRating}</p>
          </div>
        </div>

        <h2>Add a Review</h2>
        <Form onSubmit={handleReviewSubmit} className="review-form">
          <Form.Group>
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="mt-3">
            Submit
          </Button>
        </Form>

        <h2 className="review-section">Reviews</h2>
        {reviews.map((review) => (
          <div key={review._id} className="review-card-container">
            <ReviewCard
              key={review._id}
              review={review}
              onUpvote={handleUpvote}
              onRemoveUpvote={handleRemoveUpvote}
              onDelete={() => handleDeleteReview(review._id)}
              canDelete={review.user._id === userId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieDetails;
