import mongoose from "mongoose";

const playListSchema = new mongoose.Schema({
    name: {type: String, default: null},
    description: {type: String},
    public : {type: String, default: false},
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
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
    pfp:{
        type:String
    },
    reviews: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review' 
    }],

    username: {
        type:String
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
        default: null
    },

    verified: {
        type: Boolean,
        default: false
    },

    playLists: [playListSchema]

})
const User = mongoose.model("User", userSchema);
export default User;