import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser';
import Review from './models/review.js';
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

app.post('/sendemail', async (req,res)=>{
    await User.findOne({email:req.body.email})
    .then(async (user)=>{
        if(!user){
            res.send({email:false,message:"Invalid email"})
        }
        else{
            let otp = `${Math.random().toString(36).substring(2,7)}`
            await User.findOneAndUpdate({email:req.body.email},{otp:otp})
            res.send({email:true,message:"Check your email for OTP and click on link in the email",id: user._id, OTP:otp, useremail:user.email, username: user.fname})
        }
    })
})

app.post('/checkOtp', async (req,res)=>{
    await User.findOne({_id:req.body.id})
    .then(async (user)=>{
       if(user.otp == req.body.otp){
             res.send({result:true,message:"OTP is correct, enter your new password"})
        }
        else{
            res.send({result:false,message:"OTP is wrong"})
        }  
    })
})

app.post('/changepsw',(req,res)=>{
    bcrypt.hash(req.body.password, saltrounds, function(err,hash){
        User.findByIdAndUpdate({_id:req.body.id},{password:hash})
        .then(()=>{
            res.send({message:'Password updated successfully'})
        })
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




/* app.post('/review', async (req, res) => {
    try {
        const { rating, reviewText, user, movieId } = req.body;

        const newReview = new Review({
            rating,
            reviewText,
            user,
            movie: movieId
        });

        await newReview.save();
        res.send(newReview);
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).send({ message: "Server error" });
    }
});
 */



app.post('/review', async (req, res) => {
    const { user, movie, rating, reviewText } = req.body;
    
  
    try {
      
      const existingUser = await User.findOne({email:user});
      const existingMovie = await Movie.findOne({dbid:movie});
  
      if (!existingUser || !existingMovie) {
        return res.status(404).json({ message: 'User or Movie not found' });
      }

      const newReview = new Review({
        user: existingUser,
        movie: existingMovie,
        rating: parseInt(rating),
        reviewText: reviewText,
      });
  
      await newReview.save();

      res.status(201).json(newReview);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



app.get('/reviews/:movieId', async (req, res) => {
    try {
        const movie = req.params.movieId;
        const nowmovie = await Movie.findOne({dbid:movie}); 
        const reviews = await Review.find({ movie: nowmovie }).populate('user', 'fname');
        res.send(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send({ message: "Server error" });
    }
});

app.listen(port,()=>{
    console.log(`Server connected to port ${port} successfully`)
})
