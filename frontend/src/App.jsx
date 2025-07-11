import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeRoute from './routes/home/index.jsx';
import ProfileRoute from './routes/profile/index.jsx';
import MainLayout from './MainLayout.jsx';
import AuthPage from './components/AuthPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import EventsRoute from './routes/events/index.jsx';
import EditProfileRoute from './routes/edit-profile/index.jsx';
import './App.css';
import './index.css';
import MapView from './components/MapView.jsx';

import MessagePage from './components/messages/MessagePage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Auth route without layout */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Routes with layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeRoute />} />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileRoute />
          </ProtectedRoute>
        } />

        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfileRoute />
          </ProtectedRoute>
        } />

        <Route path="/events" element={
          <ProtectedRoute>
            <EventsRoute />
          </ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute>
            < MessagePage />
          </ProtectedRoute>
        } />

        <Route path="/map" element={
          <ProtectedRoute>
            < MapView />
          </ProtectedRoute>
        } />
      </Route> 
    </Routes>
  );
}
