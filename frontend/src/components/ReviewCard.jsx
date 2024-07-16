import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

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
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Reviewed by: {review.user.fname || "Anonymous"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Rating:{" "}
          <Chip label={`${review.rating}/5`} color="primary" size="small" />
        </Typography>
        <Typography variant="body1" paragraph>
          {review.reviewText}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Posted on {moment(review.createdAt).format("MMMM Do YYYY, h:mm a")}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Box>
            <Button
              startIcon={<ThumbUpIcon />}
              variant="outlined"
              color="primary"
              onClick={() => onUpvote(review._id)}
              size="small"
            >
              Upvote
            </Button>
            <Button
              startIcon={<ThumbDownIcon />}
              variant="outlined"
              color="secondary"
              onClick={() => onRemoveUpvote(review._id)}
              size="small"
              sx={{ ml: 1 }}
            >
              Remove Upvote
            </Button>
          </Box>
          <Box>
            {canDelete && (
              <Button
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                onClick={handleDeleteClick}
                size="small"
                sx={{ mr: 1 }}
              >
                Delete
              </Button>
            )}
            <Chip label={`${review.upvotes} Upvotes`} variant="outlined" />
          </Box>
        </Box>
      </CardContent>
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
