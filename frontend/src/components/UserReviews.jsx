import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserReviewCard from "./movie/UserReviewCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "./sections/NavBar";
import AlertBox from "./AlertBox";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const email = useSelector((state) => state.user.email);
  const userId = useSelector((state) => state.user.userid);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(
          `https://movie-radar-1.onrender.com/user/reviews/${email}?userId=${userId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
        setError(error.message);
      }
    };

    if (email) {
      fetchUserReviews();
    }
  }, [email, userId]);

  const handleUpvote = async (reviewId) => {
    const payload = { userId: email };

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
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to remove upvote from review"
        );
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
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <Container>
      <AlertBox/>
        <h1>Your Reviews</h1>
        {error && <p className="text-danger">Error: {error}</p>}
        <Row>
          {reviews.length === 0 ? (
            <p>No reviews found</p>
          ) : (
            reviews.map((review) => (
              <Col key={review._id} xs={12} md={6} lg={4}>
                <UserReviewCard
                  key={review._id}
                  review={review}
                  onUpvote={handleUpvote}
                  onRemoveUpvote={handleRemoveUpvote}
                  onDelete={() => handleDeleteReview(review._id)}
                  canDelete={true}
                  userid={review.user._Id}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default UserReviews;
