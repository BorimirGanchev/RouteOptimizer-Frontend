import { useState } from 'react'
import SignIn from './SignIn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './SignUp'
import PrivateRoute from './components/PrivateRoutes'
import AdminHome from './AdminHome'
import UserHome from './UserHome'
import NavBar from './components/NavBar'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<PrivateRoute><SignUp/></PrivateRoute>} />
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
