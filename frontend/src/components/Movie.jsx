import React from "react";

function Movie() {
  const submitHandle = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/getMovie", {
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
