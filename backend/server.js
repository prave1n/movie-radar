import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser';
import User from './models/user.js';
import Movie from './models/movie.js';

// Create API server
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin:true 
}));


dotenv.config();
const port = process.env.PORT;

// Strength of password protection (BCRYPT)
const saltrounds = 10; 
mongoose.connect("mongodb+srv://linkesvarun:JUF076PvImPU5eQt@clustertest.chekyvj.mongodb.net/sample_tester" )
.then(()=>{
    console.log('Connected to the database')
})
.catch((err)=>{
    console.log(err)
})

//JWT
const jsonwebtoken = process.env.JWT_SECRET

app.post('/signIn',(req,res)=>{
    bcrypt.hash(req.body.password, saltrounds, function(err,hash){
        const user = new User({
            fname: req.body.firstname,
            lname:req.body.lastname,
            email: req.body.email,
            password: hash, //HASH FROM Bcrypt
        })

        user.save()
        .then(()=>{
            res.send({message:"Account created successfully. You may login Now"})
        })
        .catch((err)=>{
            console.log(err)
        })
    })
})

app.post('/login',(req,res)=>{
    User.findOne({email:req.body.email})
    .then((user)=>{
        if(!user){
            res.send({login:false,message:"Invalid email"})
        }
        else{
            bcrypt.compare(req.body.password,user.password,function (err,result){
                if(result == true){
                    const token = jwt.sign({id:user._id, username:user.email,type:"user"}, jsonwebtoken, {expiresIn: "2h"})
                    res.cookie("token", token, {maxAge: 2 * 60 * 60 * 1000, httpOnly: true}) 
                    res.send({login:true,user:user, token:token})
                }
                else{
                    res.send({login:false,message:"Invalid password"})
                }
            })
        }
    })
})

app.get('/logout',(req,res)=>{
    res.clearCookie("token")
})

async function getMovieData() {
    let response = [];
    for(let i = 1; i <= 500; i ++) {
        
        const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=popularity.desc`;
        const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTQyMWZlNmNmOTM2MDI2NjEzNTRjYzRhOTgzNjRmMyIsInN1YiI6IjY0N2FiODI4Y2FlZjJkMDEzNjJhY2EzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5bh1aBfKZE2CuUZ--kHWRpL4mHB4x6fwCi9a67xGzw4'
        }
    };
    await fetch(url, options)
    .then(res => res.json())
    .then(res => response.push(res))
    .catch(err => console.error('error:' + err));
    }

    response.forEach(async (page) => {
        await page.results.forEach(async (movie) => {
            const moviedets = await new Movie({
                dbid: movie.id,
                title: movie.title,
                overview: movie.overview,
                release_date: movie.release_date,
                genre_ids: movie.genre_ids,
                picture: "https://image.tmdb.org/t/p/original" + movie.poster_path,
            })
            await moviedets.save()
        })
    })
    return response
}

app.get('/getMovie', async (req, res) => {
    const movies = await getMovieData()
    res.send(movies)
})

app.get('/movie', async (req,res) => {
    const movies = await Movie.find();
    res.send(movies);
})

app.post('/addmovie', async (req,res) => {
    // console.log(req)
    await User.findByIdAndUpdate({_id:req.body.id},{favouriteMovies: req.body.movie})
    .then(()=>{
        res.send({message:"Movie added successfully"})
    })
})

app.post('/deleteMovie', async (req,res) => {
    // console.log(req)
    await User.findByIdAndUpdate({_id:req.body.id},{favouriteMovies: req.body.movie})
    .then(()=>{
        res.send({message:"Movie deleted successfully"})
    })
})

app.get('/movie/:id', async (req, res) => {
    const movie = await Movie.findOne({ dbid: req.params.id });
    res.send(movie);
  });


/* app.get('/reviews/:movieId', async (req, res) => {
    const movie = await Movie.findOne({ dbid: req.params.movieId });
    res.send(movie.reviews);
}); */
  

app.post('/review', async (req, res) => {
    const { user, movieId, rating, reviewText } = req.body;
    const movie = await Movie.findOne({ dbid: movieId });
  
    const newReview = {
      user,
      rating,
      reviewText,
    };
  
    movie.reviews.push(newReview);
    await movie.save();
  
    res.send(newReview);
  });

/* app.post('/review', async (req, res) => {
    const { userId, movieId, rating, reviewText } = req.body;
    const movie = await Movie.findOne({ dbid: movieId });
    const user = await User.findById(userId);
  
    if (!movie || !user) {
        return res.status(404).send({ message: "Movie or User not found" });
    }

    const newReview = {
        userId,
        rating,
        reviewText,
    };

    movie.reviews.push(newReview);
    await movie.save();

    user.reviews.push({
        movieId: movie._id,
        rating,
        reviewText,
    });
    await user.save();

    res.send(newReview);
}); */


/* app.post('/review', async (req, res) => {
    const { userId, movieId, rating, reviewText } = req.body;

    try {
        const movie = await Movie.findOne({ dbid: movieId });
        const user = await User.findById(userId);

        if (!movie || !user) {
            return res.status(404).send({ message: "Movie or User not found" });
        }

        const newReview = {
            userId,
            rating,
            reviewText,
            movieId: movie._id
        };

        movie.reviews.push(newReview);
        await movie.save();

        user.reviews.push(newReview);
        await user.save();

        res.send(newReview);
    } catch (error) {
        res.status(500).send({ message: "Server error", error });
    }
}); */


  
  app.get('/reviews/:movieId', async (req, res) => {
    const movie = await Movie.findOne({ dbid: req.params.movieId }).populate('reviews.user', 'fname');
    res.send(movie.reviews);
  });


  
  /* app.post('/review', async (req, res) => {
    const { userId, movieId, rating, reviewText } = req.body;
    const movie = await Movie.findOne({ dbid: movieId });
  
    const newReview = {
      user: mongoose.Types.ObjectId(userId),
      rating,
      reviewText,
    };
  
    movie.reviews.push(newReview);
    await movie.save();
  
    res.send(await movie.populate('reviews.user', 'fname').execPopulate());
  }); */

/* app.get('/profile/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.send(user);
}); */

app.get('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).populate('reviews.movieId');
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: "Server error", error });
    }
});



app.get('/watchlist/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId).populate('favouriteMovies');
    res.send(user.favouriteMovies);
});

app.get('/user-reviews/:userId', async (req, res) => {
    const userReviews = await Movie.find({ 'reviews.userId': req.params.userId });
    const reviews = userReviews.map(movie => {
        return movie.reviews.filter(review => review.userId.toString() === req.params.userId);
    }).flat();
    res.send(reviews);
});

/* app.get('/user-reviews/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).populate('reviews.movieId');
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user.reviews);
    } catch (error) {
        res.status(500).send({ message: "Server error", error });
    }
}); */




app.listen(port,()=>{
    console.log(`Server connected to port ${port} successfully`)
})
