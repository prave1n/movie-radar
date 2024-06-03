import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup';
import Home from './components/Home';
import WatchList from './components/WatchList';


function App() {

  return (
    <BrowserRouter>
    <Routes>
          <Route exact path = '/' element={<Login/>}/>

          <Route exact path = '/signup' element={<Signup/>}/>

          <Route exact path = '/home' element={<Home/>}/>

          <Route exact path = '/watchlist' element={<WatchList/>}/>

          <Route exact path = '*' element={<p>PAGE NOT FOUND</p>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
