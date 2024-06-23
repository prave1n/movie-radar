import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import UserReviewCard from "./UserReviewCard";
import MovieCard from "./MovieCard";
import NavBar from "./NavBar";
import "./styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const userId = useSelector((state) => state.user.userid);
  const email = useSelector((state) => state.user.email);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch(`http://localhost:8080/watchlist/${userId}`)
      .then((res) => res.json())
      .then((data) => setWatchlist(data));

    fetch(`http://localhost:8080/user/reviews/${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched reviews data:", data);
        if (Array.isArray(data)) {
          setReviews(data.slice(0, 3));
        } else {
          console.error("Expected an array of reviews, received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user reviews:", error);
      });
  }, [userId, email]);

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

  return (
    <div>
      <NavBar />
      <div className="profile-container">
        <h1 className="mb-4">Profile</h1>
        <div className="personal-info mb-4">
          <p>
            <strong>First Name:</strong> {user.fname}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lname}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div className="watchlist mb-4">
          <h2>Your Watchlist</h2>
          <div className="d-flex flex-wrap">
            {watchlist.slice(0, 3).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
          {watchlist.length > 5 && (
            <Button className="mt-3" onClick={() => navigate("/watchlist")}>
              See all Movies in Watchlist
            </Button>
          )}
        </div>

        <div className="reviews mb-4">
          <h2>Your Reviews</h2>
          <ListGroup>
            {reviews.map((review) => (
              <ListGroup.Item key={review._id} className="mb-3">
                <UserReviewCard
                  key={review._id}
                  review={review}
                  onUpvote={handleUpvote}
                  onRemoveUpvote={handleRemoveUpvote}
                  onDelete={() => handleDeleteReview(review._id)}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button className="mt-3" onClick={() => navigate("/user-reviews")}>
            View All Reviews
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
