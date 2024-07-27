import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

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

function GenreSelectorPopup({ show, onHide, onSave, initialGenres }) {
  const [selectedGenres, setSelectedGenres] = useState(initialGenres || []);

  const handleCheckboxChange = (genre) => {
    setSelectedGenres((prevSelected) => {
      if (prevSelected.includes(genre)) {
        return prevSelected.filter((g) => g !== genre);
      } else {
        return [...prevSelected, genre].slice(0, 3);
      }
    });
  };

  const handleSave = () => {
    onSave(selectedGenres.map((genre) => ({ id: genre.id, name: genre.name })));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Your Preferred Genres</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {genres.map((genre) => (
            <Form.Check
              key={genre.id}
              type="checkbox"
              id={`genre-${genre.id}`}
              label={genre.name}
              onChange={() => handleCheckboxChange(genre)}
              checked={selectedGenres.includes(genre)}
              disabled={
                !selectedGenres.includes(genre) && selectedGenres.length === 3
              }
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={selectedGenres.length !== 3}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GenreSelectorPopup;
