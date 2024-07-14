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
import FriendRequest from './models/friendRequest.js';

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

app.post('/signIn',async (req,res)=>{
    const user = await User.findOne({email:req.body.email})
    const user2 = await User.findOne({ username:req.body.username });
    if (user) {
        res.send({result:false, message:"You already have an account linked with this email account"})
    } else if (user2) {
        res.send({result:false, message:"Username has already been taken"})
    } else {
    bcrypt.hash(req.body.password, saltrounds, function(err,hash){
        const user = new User({
            fname: req.body.firstname,
            lname:req.body.lastname,
            username:req.body.username,
            email: req.body.email,
            password: hash, //HASH FROM Bcrypt
            pfp: req.body.pfp,
            otp: `${Math.random().toString(36).substring(2,7)}`,
            telegramHandle: req.body.telegram,
        })

        user.save()
        .then((user)=>{
            res.send({result:true, message:"Account created successfully. You may login Now", userId: user._id, useremail: user.email, username:user.username, otp: user.otp})
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    }
})

app.post('/verify', async (req,res) => {
    await User.findOne({_id:req.body.id})
    .then(async (user)=>{
       if(user.otp == req.body.otp){
            await User.findByIdAndUpdate({_id:user._id},{verified:true, otp: `${Math.random().toString(36).substring(2,7)}`})
            res.send({result:true,message:"OTP is correct, you may login now"})
        }
        else{
            res.send({result:false,message:"OTP is wrong", otp:user.otp})
        }  
    })
})

app.post('/resend', async (req,res) => {
    const otp = Math.random().toString(36).substring(2,7)
    await User.findByIdAndUpdate({_id:req.body.id},{otp: otp})
    .then((user)=>{
       if(user){
            res.send({result:true,message:"Your verification code has been resent",otp: otp, useremail: user.email, username:user.username,})
        }
        else{
            res.send({result:false,message:"You have not registered properly"})
        }  
    })
})

app.post('/login',(req,res)=>{
    User.findOne({email:req.body.email})
    .then((user)=>{
        if(!user){
            res.send({login:false,message:"Invalid email"})
        } else if (!user.verified){
            res.send({login:false,message:"Your email account still has not been verified"})
        } else {
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

app.post("/auth", async (req,res) => {
    const token = req.body.token
    if (!token) {
        return res.send({ login: false });
    } else {
        try {
            const decoded = jwt.verify(token, jsonwebtoken);
            const userId = decoded.id
            const user = await User.findOne({_id:userId}) 
            return res.send({login: true, user: user})
        } catch (err) {
            return res.send({ login: false });
        }
    }
   
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
  
app.get('/myhome', async (req, res) => {
      const userId = req.query.userId;
  
      if (!userId) {
          return res.status(400).send('User ID is required');
      }
  
      try {
          const user = await User.findById(userId);
  
          if (!user) {
              return res.status(404).send('User not found');
          }
  
          const preferredGenres = user.preferredGenres.length > 0 ? user.preferredGenres : genres.sort(() => 0.5 - Math.random()).slice(0, 3);
  
          let moviesByGenre = [];
          for (const genre of preferredGenres) {
              const movies = await Movie.find({ genre_ids: genre.id }).limit(15).lean();
              moviesByGenre.push({ genre: genre.name, movies });
          }
  
          res.json(moviesByGenre);
      } catch (error) {
          console.error("Error fetching movies:", error);
          res.status(500).send(error.message);
      }
});


app.get('/get-preferred-genres', async (req, res) => {
    const userId = req.query.userId;
  
    if (!userId) {
      return res.status(400).send('User ID is required');
    }
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.json({
        preferredGenres: user.preferredGenres,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).send(error.message);
    }
});
  


  app.post('/update-preferred-genres', async (req, res) => {
    const { userId, preferredGenres } = req.body;

    if (!userId || !preferredGenres || preferredGenres.length !== 3) {
        return res.status(400).send('User ID and exactly 3 preferred genres are required');
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }
        
        user.preferredGenres = preferredGenres.map(genre => ({
            id: genre.id,
            name: genre.name
        }));

        await user.save();

        res.send('Preferred genres updated successfully');
    } catch (error) {
        console.error("Error updating preferred genres:", error);
        res.status(500).send(error.message);
    }
});

//updated /movie to handle filter by multiple genres and multiple year intervals with pagination
app.get('/movie', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const genres = req.query.genres ? req.query.genres.split(',').map(Number) : [];
    const yearRanges = req.query.yearRanges ? JSON.parse(req.query.yearRanges) : [];
    const search = req.query.search || '';
  
    let filter = {};
    let andConditions = [];
  
    if (genres.length > 0) {
      filter.genre_ids = { $in: genres };
    }
  
    if (yearRanges.length > 0) {
        const yearFilter = {
            $or: yearRanges.map(range => ({
              release_date: {
                $gte: `${range.start}-01-01`,
                $lte: `${range.end}-12-31`
              }
            }))
          };
          andConditions.push(yearFilter);
    }
  
    if (search) {
        const searchFilter = {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { overview: { $regex: search, $options: 'i' } }
            ]
          };
          andConditions.push(searchFilter);
    }

    if (andConditions.length > 0) {
        filter.$and = andConditions;
    }
  
    try {
      const totalMovies = await Movie.countDocuments(filter);
      const movies = await Movie.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
  
      const hasMore = page * limit < totalMovies;
  
      res.json({
        movies,
        hasMore,
        totalPages: Math.ceil(totalMovies / limit)
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
});


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
        const reviews = await Review.find({ movie: nowmovie })
                                    .populate('user', 'fname')
                                    .sort({ upvotes: -1, createdAt: -1 });
        res.send(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send({ message: "Server error" });
    }
});

app.delete('/review/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;
  
    try {
      await Review.findByIdAndDelete(reviewId);
  
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
});

app.get('/movie/:id/average-rating', async (req, res) => {
    try {
      const movieId = req.params.id;
      const nowMovie = await Movie.findOne({ dbid: movieId });
      
      if (!nowMovie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      const reviews = await Review.find({ movie: nowMovie._id });
      
      if (reviews.length === 0) {
        return res.json({ averageRating: null });
      }
  
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
      res.json({ averageRating });
      //console.log(averageRating);
    } catch (error) {
      console.error('Error calculating average rating:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

//upvote review
app.post('/review/upvote/:id', async (req, res) => {
    const reviewId = req.params.id;
    const { userId } = req.body;

    try {
        const user = await User.findOne({ email: userId });
        if (!user) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.upvotedBy.includes(user._id)) {
            return res.status(400).json({ message: 'User has already upvoted this review' });
        }

        review.upvotes += 1;
        review.upvotedBy.push(user._id);
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        console.error('Error upvoting review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//remove upvote from review
app.post('/review/remove-upvote/:id', async (req, res) => {
    const reviewId = req.params.id;
    const { userId } = req.body;

    try {
        const user = await User.findOne({ email: userId });
        if (!user) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (!review.upvotedBy.includes(user._id)) {
            return res.status(400).json({ message: 'User has not upvoted this review' });
        }

        review.upvotes -= 1;
        review.upvotedBy = review.upvotedBy.filter(id => id.toString() !== user._id.toString());
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        console.error('Error removing upvote from review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('favouriteMovies');
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: "Server error", error });
    }
});

//update first and last name and username
app.put('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const { fname, lname, username } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      user.fname = fname;
      user.lname = lname;
      user.username = username;
      await user.save();
  
      res.send(user);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        res.status(500).send('Server error');
    }
  });


app.get('/watchlist/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId).populate('favouriteMovies');
    res.send(user.favouriteMovies);
});

app.get('/user/reviews/:email', async (req, res) => {
    const { email } = req.params;
    //console.log(`user email: ${email}`);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const reviews = await Review.find({ user: user._id }).populate('movie', 'title');

        //console.log('id: ${user._id}');

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// FRIENDS MIDDLEWARE

app.get('/getUsers', async (req,res) => {
    const users = await User.find();
    res.send({users: users})
})

app.post(`/fReq/:id`, async (req,res) => {
    const from = await User.findById(req.params.id)
    const to = await User.findById(req.body.to)

    await FriendRequest.findOne({sender: from, recipient:to})
    .then(async (req) => {
        if(!req) {
            const newRequest = new FriendRequest({
                sender: from,
                recipient: to,
              });
        
            await newRequest.save();
            res.send({message:"Request made successfully"})
        } else {
            res.send({message:"Already made this request"})
        }
    })
})

app.get(`/fReq/get/:id`, async (req,res) => {
    const to = await User.findById(req.params.id)
    await FriendRequest.find({ recipient: to })
    .then(async (freq) => {
        res.send({fReq: freq})
    })
})

app.post('/getUserDetails', async (req,res) => {
    await User.findById(req.body.id)
    .then((user) => {
        res.send({user: user, fname: user.fname})
    })
    
})

app.delete('/fReq/delete', async (req,res) => {
   await FriendRequest.findByIdAndDelete(req.body.id)
   .then((fReq) => {
        if(fReq) {
            res.send({message:"Deletion successful"})
        } else {
            res.send({message:"Request is not found"})
        }
   })
    
})

app.post('/acceptReq', async (req,res) => {
    const freq = await FriendRequest.findByIdAndDelete(req.body.id)
   
    await User.findByIdAndUpdate(freq.recipient, {$addToSet: {friendList: freq.sender}})
    await User.findByIdAndUpdate(freq.sender, {$addToSet: {friendList: freq.recipient}})
    .then(() => {
        res.send({id: freq.sender})
    })

    /*
    await User.findById(freq.recipient)
    .then(async (user) => {
        let fList = user.friendList
        fList = fList.push(freq.sender)
        await User.findByIdAndUpdate(freq.recipient, {friendList: fList})
    })

    await User.findById(freq.sender)
    .then(async (user) => {
        let fList = user.friendList
        fList = fList.push(freq.recipient)
        await User.findByIdAndUpdate(freq.sender, {friendList: fList})
    })

    res.send({msg:"success"})
     */
})

app.delete('/friend/delete/:id', async (req,res) => {
    const id = req.params.id
    await User.findByIdAndUpdate(id, {$unset: {friendList: req.body.id}})
    .then((user) => {
        res.send({msg: "Friend Deleted", friendList: user.friendList})
    })
})

app.get("/pendingReq/:id", async (req,res) => {
    const id = req.params.id
    await FriendRequest.find({sender: id})
    .then((reqs) => {
        console.log(reqs)
        res.send({reqs: reqs})
    })
})

// Create New PlayList
app.post("/createPlaylist", async (req,res) => {
    await User.findByIdAndUpdate(req.body.id, {$push: {playLists: {name: req.body.name, description: req.body.description, movies: []}}})
    .then(async (user) => {
        const updated = await User.findById(req.body.id)
        res.send({playLists:updated.playLists})
    })
})

// Add To PlayList 
app.post("/addToPlayList", async (req,res) => {
    const movie = await Movie.findById(req.body.movieID)
    await User.findByIdAndUpdate(req.body.userID, {$push: {"playLists.$[elem].movies" : movie}},
        { 
        "arrayFilters": [{ "elem._id": req.body.playListID}], 
        }
     )
     .then(async (user) => {
        
        const updated = await User.findById(req.body.userID)
        
        res.send({user:updated})
     })
})

// Send PlayList
app.post("/getMovieList", async (req,res) => {
    const list = req.body.list;
    const movieDets = [];
    for(let id of list) {
        const movie = await Movie.findById(id)
        if(movie) {
            movieDets.push(movie)
        }
    }

    res.send({movieList:movieDets})
})

// app.post("/getPlayLists", async (req,res) => {
//     await User.findById(req.body.id)
//     .then((user) => {
//         res.send({playlist:user.playLists})
//     })
// })

// Delete PlayList
app.post("/delPlayList", async (req,res) => {
    const id = req.body.userID;
    const listID = req.body.listID
    const movie = await Movie.findById(req.body.movieID)

    await User.findByIdAndUpdate(id, {$pull: {playLists: {_id:listID}}})
    .then(async (user) => {
        const updated = await User.findById(id)
        res.send({user: updated})
    })

})

// Del Movie From PlayList 
app.post("/delmoviePlayList", async (req,res) => {
    const id = req.body.userID;
    const listID = req.body.listID
    const movieID = req.body.movieID

    const movie = await Movie.findById(movieID)
    await User.findByIdAndUpdate(id, {$pull: {"playLists.$[elem].movies" : movieID}},
        { 
        "arrayFilters": [{ "elem._id": listID}], 
        }
     )
    .then(async (user) => {
        const updated = await User.findById(id)
        res.send({user: updated})
    })

})


// Change Privacy
app.post("/changePrivacy", async (req,res) => {
    const id = req.body.userID;
    const listID = req.body.listID
    const curr = req.body.pub

    await User.findByIdAndUpdate(id, {$set: {"playLists.$[elem].public" : !curr}},
        { 
        "arrayFilters": [{ "elem._id": listID}], 
        }
     )
    .then(async (user) => {
        const updated = await User.findById(id)
        res.send({playLists: updated.playLists, pub:!curr})
    })

})


app.listen(port,()=>{
    console.log(`Server connected to port ${port} successfully`)
})
