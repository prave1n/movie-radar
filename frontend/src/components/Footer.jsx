import React from "react";
import { Box, Typography, Link, Container, Divider } from "@mui/material";
import { GitHub } from "@mui/icons-material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#013220",
        color: "#fff",
        padding: "2rem 0",
        mt: "auto",
        borderTop: "1px solid #ffffff1f",
      }}
    >
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            MovieRadar
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            gap={3}
            mb={2}
            sx={{ maxWidth: "100%" }}
          >
            <Link href="/home" color="inherit" sx={{ textDecoration: "none" }}>
              Browse
            </Link>
            <Link
              href="/profile"
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              Profile
            </Link>
            <Link
              href="/watchlist"
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              Playlists
            </Link>
            <Link
              href="/user/reviews"
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              Reviews
            </Link>
            <Link
              href="/friends"
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              Friends List
            </Link>
            <Link
              href="/activityList"
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              Activity List
            </Link>
          </Box>
          <Link
            href="https://github.com/prave1n/movie-radar"
            color="inherit"
            sx={{ fontSize: 30 }}
          >
            <GitHub />
          </Link>
        </Box>
        <Divider sx={{ backgroundColor: "#ffffff1f", mb: 2 }} />
        <Typography variant="body2" align="center" mb={1}>
          &copy; {new Date().getFullYear()} MovieRadar. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center">
          (Credits: Movie data taken from themoviedb)
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
