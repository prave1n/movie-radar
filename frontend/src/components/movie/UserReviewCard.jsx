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
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

const UserReviewCard = ({
  review,
  onUpvote,
  onRemoveUpvote,
  onDelete,
  canDelete,
  userid,
}) => {
  const handleUpvoteClick = () => {
    if (review.isUpvoted) {
      onRemoveUpvote(review._id);
    } else {
      onUpvote(review._id);
    }
  };

  const handleDeleteClick = () => {
    onDelete(review._id);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {review.movie.title || "Movie title missing"}
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
              startIcon={
                review.isUpvoted ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />
              }
              variant="outlined"
              color="primary"
              onClick={handleUpvoteClick}
              size="small"
            >
              {review.isUpvoted ? "Upvoted" : "Upvote"}
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

export default UserReviewCard;
