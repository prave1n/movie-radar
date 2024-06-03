// Get the movies from external API
function getMovieData() {
    const response = [];
    const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTQyMWZlNmNmOTM2MDI2NjEzNTRjYzRhOTgzNjRmMyIsInN1YiI6IjY0N2FiODI4Y2FlZjJkMDEzNjJhY2EzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5bh1aBfKZE2CuUZ--kHWRpL4mHB4x6fwCi9a67xGzw4'
        }
    };
    fetch(url, options)
    .then(res => res.json())
    .then(res => response = res)
    .catch(err => console.error('error:' + err));

    return response;
}

const getMovies =  async (req, res) => {
    const movies = await getMovieData()
    res.send(movies)
}

export default getMovies