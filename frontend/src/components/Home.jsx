import React, { useEffect, useState, useCallback, useRef } from "react";
import MovieCard from "./MovieCard";
import SearchBar from "./SearchBar";
import NavBar from "./NavBar";
import Pagination from "./Pagination";
import {
  Container,
  Typography,
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const yearRanges = [
  { id: 1, name: "Before 1980", start: 0, end: 1979 },
  { id: 2, name: "1980-1989", start: 1980, end: 1989 },
  { id: 3, name: "1990-1999", start: 1990, end: 1999 },
  { id: 4, name: "2000-2009", start: 2000, end: 2009 },
  { id: 5, name: "2010-2019", start: 2010, end: 2019 },
  { id: 6, name: "2020 and later", start: 2020, end: 9999 },
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYearRanges, setSelectedYearRanges] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  const updateSearch = (name) => {
    setSearch(name);
    resetState();
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreId)
        ? prevGenres.filter((id) => id !== genreId)
        : [...prevGenres, genreId]
    );
    resetState();
  };

  const handleYearRangeChange = (rangeId) => {
    setSelectedYearRanges((prevRanges) =>
      prevRanges.includes(rangeId)
        ? prevRanges.filter((id) => id !== rangeId)
        : [...prevRanges, rangeId]
    );
    resetState();
  };

  const contentStartRef = useRef(null);

  const scrollToContentStart = () => {
    if (contentStartRef.current) {
      contentStartRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    scrollToContentStart();
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    resetState();
  };

  const resetState = () => {
    setPage(1);
    //setMovies([]);
    scrollToContentStart();
  };

  const fetchMovies = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    let url = `http://localhost:8080/movie?page=${page}&limit=20`;
    const params = new URLSearchParams();

    if (sortOption !== "default") {
      params.append("sort", sortOption);
    }

    if (selectedGenres.length > 0) {
      params.append("genres", selectedGenres.join(","));
    }

    if (selectedYearRanges.length > 0) {
      const yearRangesData = selectedYearRanges.map((id) => {
        const range = yearRanges.find((range) => range.id.toString() === id);
        return { start: range.start, end: range.end };
      });
      params.append("yearRanges", JSON.stringify(yearRangesData));
    }

    if (search) {
      params.append("search", search);
    }

    url += "&" + params.toString();

    fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": true,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setMovies(res.movies);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      });
  }, [isLoading, selectedGenres, selectedYearRanges, search, page, sortOption]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Container maxWidth="xl">
        <Box my={4} textAlign="center">
          <Typography variant="h2" component="h1" gutterBottom>
            Movie List
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            (Credits: Movie data taken from themoviedb)
          </Typography>
        </Box>

        <Paper elevation={3}>
          <Box p={3} ref={contentStartRef}>
            <SearchBar setSearch={updateSearch} />

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Filter by Genres
              </Typography>
              <FormGroup row>
                {genres.map((genre) => (
                  <FormControlLabel
                    key={genre.id}
                    control={
                      <Checkbox
                        checked={selectedGenres.includes(genre.id.toString())}
                        onChange={() => handleGenreChange(genre.id.toString())}
                        name={genre.name}
                      />
                    }
                    label={genre.name}
                  />
                ))}
              </FormGroup>
            </Box>

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Filter by Release Years
              </Typography>
              <FormGroup row>
                {yearRanges.map((range) => (
                  <FormControlLabel
                    key={range.id}
                    control={
                      <Checkbox
                        checked={selectedYearRanges.includes(
                          range.id.toString()
                        )}
                        onChange={() =>
                          handleYearRangeChange(range.id.toString())
                        }
                        name={range.name}
                      />
                    }
                    label={range.name}
                  />
                ))}
              </FormGroup>
            </Box>

            <Box mt={3}>
              <FormControl fullWidth>
                <InputLabel id="sort-label">Sort by Release Date</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortOption}
                  onChange={handleSortChange}
                  label="Sort by Release Date"
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="most_recent">Most Recent</MenuItem>
                  <MenuItem value="least_recent">Least Recent</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>

        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Movies
          </Typography>
          <Divider />
          <Box mt={2} mb={2}>
            {selectedGenres.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {selectedGenres.map((genreId) => (
                  <Chip
                    key={genreId}
                    label={
                      genres.find((g) => g.id.toString() === genreId)?.name
                    }
                    onDelete={() => handleGenreChange(genreId)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                <Box
                  display="flex"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <MovieCard
                    movie={movie}
                    title={movie.title}
                    overview={movie.overview}
                    picture={movie.picture}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box display="flex" justifyContent="center" my={4}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Home;
