import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePlayLists } from '../store/userSlice';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addmovie } from "../store/userSlice";
import { Link } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


function MovieCard({ movie }) {
  const id = useSelector((state) => state.user.userid);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let watchlist = useSelector((state) => state.user.watchlist);
  const playLists = useSelector((state) => state.user.playLists);
  const [checker, setChecker] = useState(playLists)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    e.preventDefault()
    setAnchorEl(null);
  };

  const [movieAdd, setmovieAdd] = React.useState({
    show: false,
    vertical: 'top',
    horizontal: 'right',
  });

  const { show, vertical, horizontal } = movieAdd;

  const addmovieAlert = (newState) => {
    setmovieAdd({
      show: true,
      vertical: 'top',
      horizontal: 'right',
    });
  };

  const addmovieClose = (event) => {
    event.preventDefault()
    setmovieAdd({
      show: false,
      vertical: 'top',
      horizontal: 'right',
    });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const addMovieHandler = async (e) => {
    let mov = [...watchlist, movie];
    e.preventDefault();
    await fetch("https://movie-radar-2.onrender.com/addmovie", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        movie: mov,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res)
        dispatch(addmovie({ movie: movie }));
        addmovieAlert()
      });
  };
  
  const jumpToPlay = async (e) => {
    e.preventDefault()
    setAnchorEl(null);
    navigate("/watchlist")
  }

  const addToPlayList = async (e,playListID) => {
    e.preventDefault()
    if(checker.filter(x => x._id === playListID)[0].movies.filter(y => y === movie._id).length !== 0){
      alert("This movie is already part of the playlist")
    } else {
      try {
        await fetch("https://movie-radar-2.onrender.com/addToPlayList", {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": true,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playListID: playListID,
            movieID: movie._id,
            userID: id
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            addmovieAlert()
            dispatch(updatePlayLists(res.user.playLists))
            setChecker(res.user.playLists)
            setAnchorEl(null);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }
  return (
    
    <Card sx={{ maxWidth: 345, minWidth: 345, m: 1 }}>

      <Snackbar open={movieAdd.show} autoHideDuration={6000} onClose={addmovieClose} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={addmovieClose} severity="success" sx={{ width: '100%' }}>
          Movie Added Successfully
        </Alert>
      </Snackbar>
 
    <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon 
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}/>
          </IconButton>
        }
        title={movie.title}
      />
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 200,
            width: '35ch',
          },
        }}
      > 
        <MenuItem key="watchlist"  onClick={addMovieHandler}>
        <Typography component="h1" variant="body1"sx={{fontSize:"15px"}} >
        <AddIcon sx={{fontSize: "20px"}}/> Add to Watchlist  
        </Typography>
        </MenuItem>
        <Divider sx={{ bgcolor: "text.primary" }} />

        <MenuItem key="watchlist"  onClick={jumpToPlay}>
        <Typography component="h1" variant="body1"sx={{fontSize:"15px"}} >
          View My PlayLists
        </Typography>
        </MenuItem>

        <Divider x={{ bgcolor: "text" }}/>

        <MenuItem key="watchlist"  onClick={handleClose} disabled={true}>
          Select a PlayList to add the movie <ArrowDownwardIcon/>
        </MenuItem>
       

        {playLists.map((option) => (
          <MenuItem key={option.name}  onClick={e => addToPlayList(e,option._id)}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
       <CardActionArea>
      <Link
    to={`/movie/${movie.dbid}`}
    style={{ color: "white", textDecoration: "none" }}>
      <CardMedia
          component="img"
          image={movie.picture}
          alt="Image Not Found"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary" style={{ height: "12rem", overflowY:"scroll"}}>
            {movie.overview}
          </Typography>
        </CardContent>
        </Link>
      </CardActionArea>
      <CardActions sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
        <Button variant="contained" color="success" onClick={addMovieHandler}>
          Add to watchlist
        </Button>
      </CardActions>
      
    </Card>
  );
}

export default MovieCard;
