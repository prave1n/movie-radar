import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ReviewCard from "./ReviewCard";
import NavBar from "./NavBar";
import "./styles/MovieDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0.0);
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
    fetch(`http://localhost:8080/reviews/${id}?userId=${userId}`)
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
  }, [id, email, userId]);

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
    //console.log("Upvoting review:", reviewId);
    //console.log(payload);

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

  const handleStarClick = (value) => {
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
  };

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
            <Form.Label htmlFor="rating">Rating</Form.Label>
            <div id="rating">{renderStars()}</div>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="review">Review</Form.Label>
            <Form.Control
              id="review"
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
        {reviews.length === 0 ? (
          <p>
            No reviews yet. If you have watched this movie, please add a review!
          </p>
        ) : (
          reviews.map((review) => (
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
          ))
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
