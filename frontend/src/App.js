import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup';
import Home from './components/Home';
import WatchList from './components/WatchList';
//import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import Profile from './components/Profile';
import UserReviews from './components/UserReviews';
import Reset from './components/Reset';
import Otp from './components/Otp';

function App() {

  return (
    <BrowserRouter>
    <Routes>
          <Route exact path = '/' element={<Login/>}/>

          <Route exact path = '/signup' element={<Signup/>}/>

          <Route exact path = '/home' element={<Home/>}/>

          <Route exact path = '/watchlist' element={<WatchList/>}/>

          <Route exact path='/movie/:id' element={<MovieDetails />} />

          <Route path="/profile" element={<Profile />} />
          
          <Route path="/user-reviews" element={<UserReviews />} />

          <Route path="/reset" element={<Reset />} />

          <Route path="/forgotpsw/:id" element={<Otp />} />

          <Route exact path = '*' element={<p>PAGE NOT FOUND</p>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
