import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import moment from "moment";
import "./styles/UserReviewCard.css";

const UserReviewCard = ({ review, onUpvote, onRemoveUpvote, onDelete }) => {
  const handleDeleteClick = () => {
    onDelete(review._id);
  };

  return (
    <Card className="user-review-card">
      <Card.Body>
        <Card.Title>{review.movie.title || "missing to fix"}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Rating: <Badge bg="primary">{review.rating}/5</Badge>
        </Card.Subtitle>
        <Card.Text>{review.reviewText}</Card.Text>
        <Card.Text>
          <small className="text-muted">
            Posted on {moment(review.createdAt).format("MMMM Do YYYY, h:mm a")}
          </small>
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Button
              variant="outline-success"
              onClick={() => onUpvote(review._id)}
            >
              Upvote
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => onRemoveUpvote(review._id)}
              className="ms-2"
            >
              Remove Upvote
            </Button>
          </div>

          <div className="deletereviews-upvote-section">
            <Button
              variant="danger"
              onClick={handleDeleteClick}
              className="mb-2"
            >
              Delete
            </Button>
            <Badge bg="secondary">{review.upvotes} Upvotes</Badge>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserReviewCard;
