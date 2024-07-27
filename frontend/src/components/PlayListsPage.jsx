import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "./NavBar";
import WatchList from "./WatchList";
import PlayListsCard from "./PlayListsCard";
import { updatePlayLists } from "../store/userSlice";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//import TextField from "@mui/material/TextField";
//import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

function PlayListsPage() {
  const dispatch = useDispatch();
  const playLists = useSelector((state) => state.user.playLists);
  const id = useSelector((state) => state.user.userid);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/createPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          description,
        }),
      });
      const data = await response.json();
      dispatch(updatePlayLists(data.playLists));
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <NavBar />
      <WatchList />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Your Playlists
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{ textTransform: "none" }}
          >
            Create Playlist
          </Button>
        </Box>

        {playLists.map((list) => (
          <PlayListsCard key={list._id} list={list} />
        ))}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ fontWeight: "bold" }}>Create Playlist</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the name and description of your playlist
            </DialogContentText>
            <FormControl fullWidth margin="dense">
              <InputLabel htmlFor="name">Name</InputLabel>
              <OutlinedInput
                id="name"
                placeholder="Enter playlist name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Name"
              />
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel htmlFor="description">Description</InputLabel>
              <OutlinedInput
                id="description"
                placeholder="Enter playlist description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                label="Description"
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button onClick={createHandler} sx={{ textTransform: "none" }}>
              Create New Playlist
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default PlayListsPage;
