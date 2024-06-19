import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
//import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const userId = useSelector((state) => state.user.userid);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch(`http://localhost:5000/watchlist/${userId}`)
      .then((res) => res.json())
      .then((data) => setWatchlist(data));

    fetch(`http://localhost:5000/user-reviews/${userId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [userId]);

  return (
    <div>
      <h1>Profile</h1>
      <p>First Name: {user.fname}</p>
      <p>Last Name: {user.lname}</p>
      <p>Email: {user.email}</p>

      <h2>Watchlist</h2>
      <ListGroup>
        {watchlist.slice(0, 5).map((movie) => (
          <ListGroup.Item key={movie._id}>{movie.title}</ListGroup.Item>
        ))}
      </ListGroup>
      <Button onClick={() => navigate("/watchlist")}>View All</Button>

      <h2>Reviews</h2>
      <ListGroup>
        {reviews.slice(0, 5).map((review) => (
          <ListGroup.Item key={review._id}>
            <p>Movie: {review.movie.title}</p>
            <p>Rating: {review.rating}</p>
            <p>{review.reviewText}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button onClick={() => navigate("/user-reviews")}>View All</Button>
    </div>
  );
};

export default Profile;
