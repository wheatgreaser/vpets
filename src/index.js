import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Signup from './Signup';
import Login from './Login';
import Starterpick from './Starterpick';
import Shop from './Shop'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/starterpick" element={<Starterpick />} />
      <Route path="/shop" element={<Shop />} />
    </Routes>
  </BrowserRouter>
);
