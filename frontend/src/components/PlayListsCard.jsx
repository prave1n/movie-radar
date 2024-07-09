import React, { useEffect } from 'react'
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updatePlayLists } from '../store/userSlice';

function PlayListsCard({list}) {
    const [movies, setMovies] = useState([])
    const dispatch = useDispatch();
    const playLists = useSelector((state) => state.user.playLists);
    const id = useSelector((state) => state.user.userid);

    useEffect(() => {
        try {
          fetch("http://localhost:8080/getMovieList", {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin": true,
              "Content-Type": "application/json",
            }, 
            body: JSON.stringify({
              list: playLists.filter(x => x._id === list._id)[0].movies
            }),
          })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            setMovies(res.movieList)
          })
        } catch (err) {
          console.log(err)
        } // eslint-disable-next-line 
      },[playLists]) 
    
      const delPlayList = (e) => {
        e.preventDefault()
        try {
            fetch("http://localhost:8080/delPlayList", {
              method: "POST",
              headers: {
                "Access-Control-Allow-Origin": true,
                "Content-Type": "application/json",
              }, 
              body: JSON.stringify({
                userID: id,
                listID:list._id
              }),
            })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
                console.log(res)
                dispatch(updatePlayLists(res.user.playLists))
            })
          } catch (err) {
            console.log(err)
          }
      }

      const delMovie = (e,movieID) => {
        e.preventDefault()
        try {
            fetch("http://localhost:8080/delmoviePlayList", {
              method: "POST",
              headers: {
                "Access-Control-Allow-Origin": true,
                "Content-Type": "application/json",
              }, 
              body: JSON.stringify({
                userID: id,
                listID:list._id,
                movieID: movieID
              }),
            })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
                alert(`Movie deleted from ${list.name}`)
                dispatch(updatePlayLists(res.user.playLists))
            })
          } catch (err) {
            console.log(err)
          }
      }
    
  return (
    <div>
    
    <CardHeader
      action={
        <Button variant="outlined" color="error"  startIcon={<DeleteIcon />} sx={{height:"40px"}} onClick={delPlayList}>
                     Delete Playlist
         </Button>
      }
      title= {list.name}
      subheader= {list.description}
    /> 
    

      <div
        class="d-flex scroll"
        style={{ marginTop: "10px", width: "1500px", overflowX: "scroll" }}
      > {list.movies.length === 0 ? <div style={{width:"1500px", height:"300px", display:"flex", alignItems:"center", justifyContent:"center"}}>PlayList is Empty</div> : <></> }
        {movies.map((movie) => {
          return (
            <Card sx={{ maxWidth: 345, minWidth: 345, m: 1, display:"flex", flexDirection:'column'}}>
                <CardHeader title={movie.title}  titleTypographyProps={{variant:'h6' }}/>
              <CardActionArea>
                <Link
                    to={`/movie/${movie._id}`}
                    style={{ color: "white", textDecoration: "none" }}>
                <CardMedia
                    component="img"
                    image={movie.picture}
                    alt="Image Not Found"
                />
                        </Link>
                        </CardActionArea>
                    <CardActions sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <Button variant="contained" color="error"  startIcon={<DeleteIcon />} sx={{height:"40px"}} onClick={(e) => {delMovie(e,movie._id)}}>
                        Delete From Playlist
                    </Button>
                </CardActions>
            </Card>
          );
        })}
      </div>
    </div>
  )
}

export default PlayListsCard