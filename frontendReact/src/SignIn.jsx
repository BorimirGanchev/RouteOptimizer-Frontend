import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from './assets/FerrariDrivers.png';

const SignIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const apiHost = import.meta.env.VITE_API_URL ;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${apiHost}/backend/login`, { email, password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.user.role);

          if (response.data.user.role === "admin") {
            navigate("/admin-home");
          } else {
            navigate("/user-home");
          }
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div
        className="hidden md:flex w-1/2 bg-[#60050b] text-white flex-col justify-center items-start p-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="text-left max-w-lg bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-5xl font-bold mb-4">Your Trusted</h1>
          <h1 className="text-5xl font-bold mb-4">Partner in Logistics.</h1>
          <p className="text-lg">
            At Fly, we ensure fast and reliable delivery services, tailored to meet your needs with efficiency and care.
          </p>
        </div>
      </div>

      <div className="w-full min-h-screen md:w-1/2 flex items-center  justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-semibold text-center mb-4">Log in</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="mb-4 px-10 py-3 text-white font-bold rounded-md hover:opacity-90 bg-gradient-to-r from-black to-red-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
