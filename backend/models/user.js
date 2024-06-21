import mongoose from "mongoose";

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
    }]
})
const User = mongoose.model("User", userSchema);
export default User;