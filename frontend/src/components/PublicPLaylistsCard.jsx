import React, { useEffect, useState } from "react";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import Chip from "@mui/material/Chip";
import SecurityIcon from "@mui/icons-material/Security";
import PublicIcon from "@mui/icons-material/Public";

function PublicPlayListsCard({ list }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    try {
      fetch("http://localhost:8080/getMovieList", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list: list.movies,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setMovies(res.movieList);
        });
    } catch (err) {
      console.log(err);
    }
  }, [list.movies]);

  return (
    <div>
      <CardHeader
        title={
          <div>
            {list.name}{" "}
            <Chip
              variant="filled"
              color="primary"
              label={list.public ? "Public" : "Private"}
              icon={list.public ? <PublicIcon /> : <SecurityIcon />}
            />
          </div>
        }
        subheader={list.description}
      />

      <div
        className="d-flex scroll"
        style={{ marginTop: "10px", width: "1500px", overflowX: "scroll" }}
      >
        {list.movies.length === 0 ? (
          <div
            style={{
              width: "1500px",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            PlayList is Empty
          </div>
        ) : (
          movies.map((movie) => (
            <Card
              key={movie._id}
              sx={{
                maxWidth: 345,
                minWidth: 345,
                m: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardHeader
                title={movie.title}
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardActionArea>
                <Link
                  to={`/movie/${movie.dbid}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <CardMedia
                    component="img"
                    image={movie.picture}
                    alt="Image Not Found"
                  />
                </Link>
              </CardActionArea>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default PublicPlayListsCard;
