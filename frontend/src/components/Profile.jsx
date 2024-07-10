import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import UserReviewCard from "./UserReviewCard";
import MovieCard from "./MovieCard";
import NavBar from "./NavBar";
import "./styles/Profile.css";
import Form from "react-bootstrap/Form";

const Profile = () => {
  const [user, setUser] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const userId = useSelector((state) => state.user.userid);
  const email = useSelector((state) => state.user.email);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://movie-radar-2.onrender.com/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFname(data.fname);
        setLname(data.lname);
      });

    fetch(`https://movie-radar-2.onrender.com/watchlist/${userId}`)
      .then((res) => res.json())
      .then((data) => setWatchlist(data));

    fetch(`https://movie-radar-2.onrender.com/user/reviews/${email}`)
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
        `https://movie-radar-2.onrender.com/review/upvote/${reviewId}`,
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
        `https://movie-radar-2.onrender.com/review/remove-upvote/${reviewId}`,
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
      const response = await fetch(
        `https://movie-radar-2.onrender.com/review/${reviewId}`,
        {
          method: "DELETE",
        }
      );
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
    const updatedUser = { fname, lname };

    try {
      const response = await fetch(
        `https://movie-radar-2.onrender.com/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        throw new Error("failed to update user name");
      }

      const updatedUserData = await response.json();
      setUser(updatedUserData);
      setIsEditing(false);
    } catch (error) {
      console.error("error updating profile:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="profile-container">
        <h1 className="mb-4">Profile</h1>
        <div className="personal-info mb-4">
          {isEditing ? (
            <div>
              <Form.Group controlId="formFname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formLname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleSaveClick}
                className="mt-2"
              >
                Save
              </Button>
            </div>
          ) : (
            <div>
              <p>
                <strong>First Name:</strong> {user.fname}
              </p>
              <p>
                <strong>Last Name:</strong> {user.lname}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <Button variant="secondary" onClick={handleEditClick}>
                Edit
              </Button>
            </div>
          )}
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
