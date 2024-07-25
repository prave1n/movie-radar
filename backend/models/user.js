import mongoose from "mongoose";

const playListSchema = new mongoose.Schema({
    name: {type: String, default: null},
    description: {type: String},
    public : {type: String, default: false},
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

const recommendedMovieSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    title: { type: String },
    score: { type: Number }
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
        unique: true,
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
    pfp:{
        type:String
    },
    reviews: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review' 
    }],

    username: {
        type:String,
        unique: true,
        required: true,

    },
    friendList : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],

    activityList : [String],

    status : {
        type: String,
        default: "offline"
    },
    telegramHandle: {
        type: String,
        unique: true,
        default: null
    },

    verified: {
        type: Boolean,
        default: false
    },

    playLists: [playListSchema],

    preferredGenres: {
        type: [{
          id: Number,
          name: String
        }],
        validate: {
          validator: function(arr) {
            return arr.length <= 3;
          },
          message: 'You can select up to 3 preferred genres only.'
        },
        default: []
    },
    
    recommendedMovies: [recommendedMovieSchema]
})
const User = mongoose.model("User", userSchema);
export default User;