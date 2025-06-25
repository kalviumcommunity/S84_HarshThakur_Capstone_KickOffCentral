import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './assets/pages/LandingPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;