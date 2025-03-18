import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Typography, Avatar, Box, Divider } from "@mui/material";
import UserReviewCard from "../movie/UserReviewCard";
import NavBar from "../sections/NavBar";
import PublicPlayListsCard from "../PublicPLaylistsCard";
import AlertBox from "../AlertBox";

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const { username } = useParams();
  const userId = useSelector((state) => state.user.userid);
  const userEmail = useSelector((state) => state.user.email);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(
          `https://movie-radar-1-qk2b.onrender.com/user/${username}`
        );
        if (!userResponse.ok) {
          throw new Error("User not found");
        }
        const userData = await userResponse.json();
        setUser(userData);

        const reviewsResponse = await fetch(
          `https://movie-radar-1-qk2b.onrender.com/user/reviews/byusername/${username}?currentUserId=${userId}`
        );
        if (reviewsResponse.status === 404) {
          // User found but has no reviews
          setReviews([]);
        } else if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        } else {
          const reviewsData = await reviewsResponse.json();
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        }

        const playlistsResponse = await fetch(
          `https://movie-radar-1-qk2b.onrender.com/user/playlists/${username}`
        );
        if (!playlistsResponse.ok) {
          throw new Error("Failed to fetch playlists");
        }
        const playlistsData = await playlistsResponse.json();
        setPlaylists(Array.isArray(playlistsData) ? playlistsData : []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username, userId]);

  const handleUpvote = async (reviewId) => {
    const payload = { userId: userEmail };
    try {
      const response = await fetch(
        `https://movie-radar-1-qk2b.onrender.com/review/upvote/${reviewId}`,
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
            ? { ...review, upvotes: review.upvotes + 1, isUpvoted: true }
            : review
        )
      );
    } catch (error) {
      console.error("Error upvoting review:", error);
    }
  };

  const handleRemoveUpvote = async (reviewId) => {
    const payload = { userId: userEmail };
    try {
      const response = await fetch(
        `https://movie-radar-1-qk2b.onrender.com/review/remove-upvote/${reviewId}`,
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
            ? { ...review, upvotes: review.upvotes - 1, isUpvoted: false }
            : review
        )
      );
    } catch (error) {
      console.error("Error removing upvote from review:", error);
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <NavBar />
      <AlertBox />
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" my={4}>
          <Avatar
            src={user.pfp}
            alt={user.username}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4">{user.username}</Typography>
            <Typography variant="subtitle1">{`${user.fname} ${user.lname}`}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <UserReviewCard
              key={review._id}
              review={review}
              onUpvote={handleUpvote}
              onRemoveUpvote={handleRemoveUpvote}
              onDelete={() => {}}
              canDelete={review.user._id === userId}
              currentUserId={userId}
            />
          ))
        ) : (
          <Typography>No reviews found.</Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Public Playlists
        </Typography>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <PublicPlayListsCard key={playlist._id} list={playlist} />
          ))
        ) : (
          <Typography>No public playlists found.</Typography>
        )}
      </Container>
    </Box>
  );
}

export default UserProfilePage;
