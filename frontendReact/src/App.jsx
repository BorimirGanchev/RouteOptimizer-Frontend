import React, { useState } from 'react'; // Import useState
import SignIn from './SignIn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import PrivateRoute from './components/PrivateRoutes';
import AdminHome from './AdminHome';
import UserHome from './UserHome';
import NavBar from './components/NavBar';
import ManageUsers from './ManageUsers';
import NewOrder from './NewOrder';

function App() { 

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/signup"
          element={
            <PrivateRoute role="admin">
              <SignUp />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <PrivateRoute role="admin">
              <ManageUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-home"
          element={
            <PrivateRoute role="admin">
              <AdminHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-home"
          element={
            <PrivateRoute role="user">
              <UserHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-order"
          element={
            <PrivateRoute role="admin">
              <NewOrder /> 
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;