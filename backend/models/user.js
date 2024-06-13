import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    rating: Number,
    reviewText: String,
});

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
    },
    lname:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
        
    },
    otp:{
        type:String,
        default:null
    },
    favouriteMovies:{
        type:Array
    },
    reviews: [reviewSchema],
    pfp:{
        type:String
    }
})
const User = mongoose.model("User", userSchema);
export default User;