import React from "react";
import Form from "react-bootstrap/Form";

function SearchBar({ setSearch }) {
  const handleSearch = (val) => {
    setSearch(val);
  };
  return (
    <div>
      <Form.Control
        className="searchBar"
        type="text"
        id="search"
        placeholder="Type to search title and overview ..."
        onChange={(e) => handleSearch(e.target.value)}
        style={{ height: "50px", width: "600px", marginTop: "70px" }}
      />
    </div>
  );
}

export default SearchBar;
