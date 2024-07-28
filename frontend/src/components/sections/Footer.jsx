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
          &copy; {new Date().getFullYear()} MovieRadar. All rights not reserved.
        </Typography>
        <Typography variant="body2" align="center">
          (Credits: Movie data taken from themoviedb)
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
