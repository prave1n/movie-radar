import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup';
import Home from './components/Home';
import MyHome from  './components/MyHome'
import MovieDetails from './components/MovieDetails';
import Profile from './components/Profile';
import UserReviews from './components/UserReviews';
import Reset from './components/Reset';
import Otp from './components/Otp'; 
import {useEffect } from 'react';
import FriendsPage from './components/FriendsPage';
import { useDispatch } from 'react-redux';
import { newuser } from './store/userSlice';
import { clearuser } from './store/userSlice';
import { useSelector } from 'react-redux';
import Verify from './components/Verify';
import PlayListsPage from './components/PlayListsPage';

function App() { 
  const loggedIn = useSelector((state) => state.user.authorized);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token")
 
    try {
      fetch("https://movie-radar-2.onrender.com/auth", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": true,
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({
          token: token
        }),
      })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if(res.login) {
          dispatch(newuser(res.user));
          
        } else {
          dispatch(clearuser());
          
          localStorage.removeItem("persist:root");
          localStorage.removeItem("token");
        }
      })
    } catch (err) {
      console.log(err)
    } // eslint-disable-next-line 
  },[]) 
  

  return (
    <BrowserRouter>
    <Routes>
          <Route exact path = '/' element={!loggedIn ? <Login/> : <Home/>}/>

          <Route exact path = '/signup' element={<Signup/>}/>

          <Route exact path = '/home' element={!loggedIn ? <Login/> : <Home/>}/>

          <Route exact path = '/myhome' element={!loggedIn ? <Login/> : <MyHome/>}/>

          <Route exact path = '/watchlist' element={!loggedIn ? <Login/> : <PlayListsPage/>}/>

          <Route exact path='/movie/:id' element={!loggedIn ? <Login/> : <MovieDetails />} />

          <Route path="/profile" element={!loggedIn ? <Login/> : <Profile />} />
          
          <Route path="/user-reviews" element={!loggedIn ? <Login/> : <UserReviews />} />

          <Route path="/user/reviews" element={!loggedIn ? <Login/> : <UserReviews />} />

          <Route path="/reset" element={<Reset />} />

          <Route path="/forgotpsw/:id" element={ <Otp />} />

          <Route path="/verify/:id" element={ <Verify/>} />

          <Route path="/friends" element={!loggedIn ? <Login/> : <FriendsPage />} />

          <Route exact path = '*' element={<p>PAGE NOT FOUND</p>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
