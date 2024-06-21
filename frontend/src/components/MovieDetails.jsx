import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const email = useSelector((state) => state.user.email);

  useEffect(() => {
    console.log(email)
    //fetch movie details
    fetch(`http://localhost:8080/movie/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));

    //fetch reviews
    fetch(`http://localhost:8080/reviews/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user: email,
      movie: id,
      rating,
      reviewText,
    };
    console.log("Payload:", payload);
    console.log(email);
    await fetch(`http://localhost:8080/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: email, movie: id, rating, reviewText }),
    })
      .then((res) => res.json())
      .then((data) => setReviews([...reviews, data]));

    setRating(0);
    setReviewText("");
  };

  return (
    <div>
      <Button onClick={() => navigate(-1)}>Back</Button>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <p>Release Date: {movie.release_date}</p>
      <img src={movie.picture} alt={movie.title} />

      <h2>Add a Review</h2>
      <Form onSubmit={handleReviewSubmit}>
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
        <Button type="submit">Submit</Button>
      </Form>

      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review._id}>
          <p>User: {review.user?.fname || "Anonymous"}</p>
          <p>Rating: {review.rating}</p>
          <p>Review: {review.reviewText}</p>
        </div>
      ))}
    </div>
  );
}

export default MovieDetails;
