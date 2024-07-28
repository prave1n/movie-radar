import React, { useEffect, useState, useCallback, useRef } from "react";
import MovieCard from "./movie/MovieCard";
import MovieSearchBar from "./movie/MovieSearchBar";
import NavBar from "./sections/NavBar";
import Pagination from "./Pagination";
import Footer from "./sections/Footer";
import AlertBox from "./AlertBox";

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
  IconButton,
  Collapse,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  const [openGenres, setOpenGenres] = useState(false);
  const [openYearRanges, setOpenYearRanges] = useState(false);
  const [openSort, setOpenSort] = useState(false);

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
    let url = `http://localhost:8080/movie?page=${page}&limit=30`;
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
      <br />
      <Container maxWidth="xl">
      <AlertBox/>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2.5}>
            <Paper elevation={3}>
              <Box p={3}>
                <MovieSearchBar setSearch={updateSearch} />

                <Box mt={3}>
                  <Typography variant="h7" gutterBottom>
                    <Box display="flex" alignItems="center">
                      <span>Filter by Genres</span>
                      <IconButton
                        onClick={() => setOpenGenres(!openGenres)}
                        aria-label="toggle genres filter"
                      >
                        {openGenres ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Typography>
                  <Collapse in={openGenres}>
                    <FormGroup>
                      {genres.map((genre) => (
                        <FormControlLabel
                          key={genre.id}
                          control={
                            <Checkbox
                              checked={selectedGenres.includes(
                                genre.id.toString()
                              )}
                              onChange={() =>
                                handleGenreChange(genre.id.toString())
                              }
                              name={genre.name}
                            />
                          }
                          label={genre.name}
                        />
                      ))}
                    </FormGroup>
                  </Collapse>
                </Box>

                <Box mt={3}>
                  <Typography variant="h7" gutterBottom>
                    <Box display="flex" alignItems="center">
                      <span>Filter by Release Years</span>
                      <IconButton
                        onClick={() => setOpenYearRanges(!openYearRanges)}
                        aria-label="toggle release year filter"
                      >
                        {openYearRanges ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>
                  </Typography>
                  <Collapse in={openYearRanges}>
                    <FormGroup>
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
                  </Collapse>
                </Box>

                <Box mt={3}>
                  <Typography variant="h7" gutterBottom>
                    <Box display="flex" alignItems="center">
                      <span>Sort by Release Date</span>
                      <IconButton
                        onClick={() => setOpenSort(!openSort)}
                        aria-label="toggle sort options"
                      >
                        {openSort ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Typography>
                  <Collapse in={openSort}>
                    <FormControl fullWidth>
                      <InputLabel id="sort-label">
                        Sort by Release Date
                      </InputLabel>
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
                  </Collapse>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box mb={2}>
              <Typography variant="h5" gutterBottom>
                Browse Movies
              </Typography>
              <Divider />
            </Box>
            <Grid container spacing={2}>
              {movies.map((movie) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={movie._id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="center" my={4}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default Home;
