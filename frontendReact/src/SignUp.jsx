import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const apiHost = import.meta.env.VITE_API_HOST ;

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("JWT Token:", token);
    axios
      .post(`${apiHost}/signup`, {
        name: name,
        email: email,
        password: password,
        role: role, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  const handleRoleChange = (newRole) => {
    if (newRole === "admin") {
      setShowModal(true); 
    } else {
      setRole("user");
    }
  };

  const confirmAdminSelection = () => {
    setRole("admin");
    setShowModal(false);
  };

  const cancelAdminSelection = () => {
    setRole("user");
    setShowModal(false);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center mb-4">Create User</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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

          <div className="mb-4">
            <label className="block text-gray-700">Select Role</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={role === "user"}
                  onChange={() => handleRoleChange("user")}
                  className="mr-2 accent-red-700"
                />
                User
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={role === "admin"}
                  onChange={() => handleRoleChange("admin")}
                  className="mr-2 accent-red-500"
                />
                Admin
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mb-4 px-10 py-4 text-white font-bold rounded-md hover:opacity-90 bg-gradient-to-r from-black to-red-500"
          >
            Sign Up
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Warning</h2>
            <p className="text-gray-700 mb-4">
              You are about to create an admin user. Are you sure?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelAdminSelection}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmAdminSelection}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
