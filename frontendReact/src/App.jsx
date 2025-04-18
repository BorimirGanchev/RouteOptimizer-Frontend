import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { checkTokenExpiration } from "./utils/auth";
import SignIn from './SignIn';
import SignUp from './SignUp';
import PrivateRoute from './components/PrivateRoutes';
import AdminHome from './AdminHome';
import UserHome from './UserHome';
import NavBar from './components/NavBar';
import ManageUsers from './ManageUsers';
import NewOrder from './NewOrder';
import Orders from './Orders';
import ProfilePage from './ProfilePage';
import { useNavigate } from "react-router-dom";

function AuthChecker() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkTokenExpiration()) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token"); 
        localStorage.removeItem("role");
        navigate("/"); 
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  return null; 
}

function App() {
  return (
    <BrowserRouter>
      <AuthChecker />
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
          path="/orders"
          element={
            <PrivateRoute role="user">
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute role="user">
              <ProfilePage />
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
