import React, { useEffect } from 'react'
import NavBar from './NavBar'
import MovieCard from './MovieCard'
import { useState } from 'react'
import WatchList from './WatchList'

function Home() {
    const [movies, setMovies] = useState([])
    
    
    useEffect(() => {
         fetch("http://localhost:4000/movie", {
              method: "GET", 
              headers: {
                  'Access-Control-Allow-Origin':true,
                  'Content-Type': 'application/json',
              },
          })
          .then((res)=>{
              return res.json()
          }).then((res)=>{
            setMovies(res)
          })
    },[])

  return (
    <div>
        <NavBar/>
        <div> 
            <WatchList/>
        </div>
        <h1 style={{marginTop:"50px", width:"1500px", display:"flex", justifyContent:"center", fontSize:"72px"}} > Movie List</h1>
        <span style={{marginTop:"0px", width:"1500px", display:"flex", justifyContent:"center", fontSize:"20px"}}>(Credits: Movie data taken from themoviedb)</span>
        <div> 
            <div class = "d-flex flex-wrap" style={{marginTop:"10px", width:"1500px", }}>
                {movies.slice(0,999).map((movie)=>{
                    return(<div key={movie.id}><MovieCard movie = {movie} title = {movie.title} overview = {movie.overview}  picture = {movie.picture} /></div>)
                })}
             </div>
        </div>
    </div>
  )
}

export default Home