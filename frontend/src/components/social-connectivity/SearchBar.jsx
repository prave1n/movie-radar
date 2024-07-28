import React from "react";
import TextField from "@mui/material/TextField";

function SearchBar({ setSearch }) {
  const handleSearch = (val) => {
    setSearch(val);
  };
  return (
    <div>
      <TextField
        fullWidth
        type="text"
        id="search"
        placeholder="Type to search ..."
        label="Search for users"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ height: "50px", width: "1000px", marginTop: "20px", marginBottom: "20px" }}
      />
    </div>
  );
}

export default SearchBar;
