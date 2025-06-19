// React & Router
import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Components
import Navbar from '../src/components/Navbar.jsx';

// Pages
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import ContactusPage from '../pages/ContactusPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';

// Store / State Management
import { useAuth } from '../src/store/useAuthStore.js';

// Icons / UI
import { LoaderCircle } from 'lucide-react';

import daisyui from 'daisyui';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-primary" size={48} strokeWidth={2.5} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/contact" element={
          <PrivateRoute>
            <ContactusPage />
          </PrivateRoute>
        } />
        <Route path="/setting" element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        } />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
