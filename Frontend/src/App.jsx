import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css';
import Login from './pages/Login'
import Signup from './pages/Signup';
import Favourites from './pages/Favourites';
import Home from './pages/Home';
import VerifyOtp from './pages/VerifyOtp';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/favorites' element={<Favourites/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/verify-otp' element={<VerifyOtp/>}/>
      </Routes>
    </div>
  );
}

export default App;