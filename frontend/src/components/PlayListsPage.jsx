import React from "react";
import NavBar from "./NavBar";
import WatchList from "./WatchList";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { updatePlayLists } from "../store/userSlice";
import PlayListsCard from "./PlayListsCard";
// import { useEffect } from 'react';

function PlayListsPage() {
  const defaultTheme = createTheme();
  const dispatch = useDispatch();
  const playLists = useSelector((state) => state.user.playLists);
  const id = useSelector((state) => state.user.userid);

  // useEffect(() => {
  //     try {
  //       fetch("http://localhost:8080/getPlayLists", {
  //         method: "POST",
  //         headers: {
  //           "Access-Control-Allow-Origin": true,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           id: id
  //         }),
  //       })
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((res) => {
  //         setPlayList(res.playlist)
  //       })
  //     } catch (err) {
  //       console.log(err)
  //     } // eslint-disable-next-line
  //   },[])

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");

  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const createHandler = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8080/createPlaylist", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          name: name,
          description: description,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          dispatch(updatePlayLists(res.playLists));
          setOpen(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <NavBar />
      <WatchList />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="s">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <Typography
              component="h1"
              variant="h3"
              sx={{ borderBottom: "3px solid black" }}
            >
              Your PlayLists{" "}
              <LocalMoviesRoundedIcon sx={{ m: 1, fontSize: "54px" }} />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                color="success"
                tabIndex={-1}
                onClick={handleClickOpen}
                startIcon={<CloudUploadIcon />}
              >
                Create PlayList
              </Button>
            </Typography>

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle sx={{ width: "500px" }}>Create PlayList</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter the name and description of your playlist
                </DialogContentText>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Name"
                  type="name"
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="desc"
                  name="desc"
                  label="Description"
                  type="desc"
                  fullWidth
                  multiline
                  minRows={3}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={createHandler}>
                  Create PlayList{" "}
                </Button>
              </DialogActions>
            </Dialog>

            {playLists.map((list) => {
              return <PlayListsCard list={list} />;
            })}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default PlayListsPage;
