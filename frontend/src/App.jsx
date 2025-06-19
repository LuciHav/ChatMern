import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import Navbar from '../src/components/Navbar.jsx'; 
import HomePage from '../pages/HomePage.jsx'; 
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import ContactusPage from '../pages/ContactusPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import { axiosInstance } from './lib/axios.js';
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactusPage />} />
        <Route path="/setting" element={<SettingsPage />} />

      </Routes>
    </>
  );
};

export default App;
