import React from "react";

function Movie() {
  const submitHandle = (e) => {
    e.preventDefault();
    fetch("https://movie-radar-1-qk2b.onrender.com/getMovie", {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": true,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div>
      <button onClick={submitHandle}>Click to Add</button>
    </div>
  );
}

export default Movie;
