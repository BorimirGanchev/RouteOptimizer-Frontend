import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };


  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/users/${userId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Role: {user.role}</p>

            
            <div className="mt-2">
              <label className="text-gray-700 font-semibold">Status:</label>
              <select
                className={`ml-2 p-1 border rounded-lg ${
                  user.status === "available" ? "bg-green-300" : "bg-red-300"
                }`}
                value={user.status}
                onChange={(e) => handleStatusChange(user._id, e.target.value)}
              >
                <option value="available" className="bg-green-300">Available</option>
                <option value="unavailable" className="bg-red-300">Unavailable</option>
              </select>
            </div>

            <button
              onClick={() => handleDeleteClick(user)}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold">Are you sure?</h2>
            <p className="text-gray-600">You are about to delete {selectedUser?.name}.</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
