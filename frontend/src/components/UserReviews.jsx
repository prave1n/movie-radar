import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserReviewCard from "./UserReviewCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "./NavBar";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const email = useSelector((state) => state.user.email);
  const userId = useSelector((state) => state.user.userid);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(
          `https://movie-radar-2.onrender.com/user/reviews/${email}`
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
  }, [email]);

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

  /* const handleUpvote = async (reviewId) => {
    const payload = { userId: email };

    await fetch(`https://movie-radar-2.onrender.com/review/upvote/${reviewId}`, {
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

    await fetch(`https://movie-radar-2.onrender.com/review/remove-upvote/${reviewId}`, {
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

  return (
    <div>
      <NavBar />
      <Container>
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
                  canDelete={review.user._id === userId}
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

/* import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const email = useSelector((state) => state.user.email);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(
          `https://movie-radar-2.onrender.com/user/reviews/${email}`
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
  }, [email]);

  const handleUpvote = async (reviewId) => {
    const payload = { userId: email };

    await fetch(`https://movie-radar-2.onrender.com/review/upvote/${reviewId}`, {
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

    await fetch(`https://movie-radar-2.onrender.com/review/remove-upvote/${reviewId}`, {
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
  };

  return (
    <Container>
      <h1>Your Reviews</h1>
      {error && <p className="text-danger">Error: {error}</p>}
      <Row>
        {reviews.length === 0 ? (
          <p>No reviews found</p>
        ) : (
          reviews.map((review) => (
            <Col key={review._id} xs={12} md={6} lg={4}>
              <ReviewCard
                key={review._id}
                review={review}
                onUpvote={handleUpvote}
                onRemoveUpvote={handleRemoveUpvote}
                //onDelete={() => handleDeleteReview(review._id)} //needs to be fixed!!
                //canDelete={review.user?.email === email} //needs to be fixed!!
              />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default UserReviews;
 */
