import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearuser } from "../store/userSlice";
import { Link } from "react-router-dom";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(clearuser());
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#013220" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/myhome"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          MovieRadar
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/home">
            Browse
          </Button>
          <Button color="inherit" component={Link} to="/profile">
            Profile
          </Button>
          <Button color="inherit" component={Link} to="/watchlist">
            Playlists
          </Button>
          <Button color="inherit" component={Link} to="/user/reviews">
            Reviews
          </Button>
          <Button color="inherit" component={Link} to="/friends">
            Friends List
          </Button>
          <Button color="inherit" component={Link} to="/activityList">
            Activity List
          </Button>
          <Button color="inherit" onClick={logoutHandler}>
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
