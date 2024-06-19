import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const userId = useSelector((state) => state.user.userid);

  useEffect(() => {
    fetch(`http://localhost:5000/user-reviews/${userId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [userId]);

  return (
    <div>
      <h1>User Reviews</h1>
      <ListGroup>
        {reviews.map((review) => (
          <ListGroup.Item key={review._id}>
            <p>Movie: {review.movie.title}</p>
            <p>Rating: {review.rating}</p>
            <p>{review.reviewText}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default UserReviews;
