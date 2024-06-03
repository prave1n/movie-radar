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
    }
})
const User = mongoose.model("user",userSchema);
export default User;