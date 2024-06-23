import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import moment from "moment";
import "./styles/ReviewCard.css";

const ReviewCard = ({
  review,
  onUpvote,
  onRemoveUpvote,
  onDelete,
  canDelete,
}) => {
  const handleDeleteClick = () => {
    onDelete(review._id);
  };

  return (
    <Card className="review-card">
      <Card.Body>
        <Card.Title>Reviewed by: {review.user.fname || "Anonymous"}</Card.Title>
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
          <div className="delete-review-section">
            {canDelete && (
              <Button
                variant="danger"
                onClick={handleDeleteClick}
                className="mb-2"
              >
                Delete
              </Button>
            )}
            <Badge bg="secondary">{review.upvotes} Upvotes</Badge>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;

/* import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import moment from "moment";
import "./styles/ReviewCard.css";

const ReviewCard = ({ review, onUpvote, onRemoveUpvote }) => {
    return (
      <Card className="review-card">
        <Card.Body>
          <Card.Title>
            Reviewed by: {review.user?.fname || "Anonymous"}
          </Card.Title>
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
            <Badge bg="secondary">{review.upvotes} Upvotes</Badge>
          </div>
        </Card.Body>
      </Card>
    );
  };

export default ReviewCard; */
