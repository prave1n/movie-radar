import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    dbid:{
        type:String,
    },
    title:{
        type:String,
    },
    overview:{
        type:String,
    },
    release_date:{
        type:String,
    },
    genre_ids: {
        type:Array,
    },
    picture:{
        type:String,
    },
    reviews: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review' 
    }]
})
const Movie = mongoose.model("Movie",movieSchema);
export default Movie; 