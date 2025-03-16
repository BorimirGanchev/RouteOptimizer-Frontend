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

  const handleAssignOrders = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // 🔹 Step 1: Fetch orders from your backend (not Python)
      const ordersResponse = await axios.get("http://localhost:8000/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Fetched orders from backend:", ordersResponse.data);
  
      // 🔹 Step 2: Extract processed orders (this is already sent to Python inside the backend)
      const orderAssignment = ordersResponse.data; // Expected: { "orderId1": 0, "orderId2": 1, ... }
  
      if (!orderAssignment || Object.keys(orderAssignment).length === 0) {
        alert("No valid orders for deployment.");
        return;
      }
  
      // 🔹 Step 3: Group orders by cluster
      const clusteredOrders = {};
      for (const [orderId, cluster] of Object.entries(orderAssignment)) {
        if (!clusteredOrders[cluster]) clusteredOrders[cluster] = [];
        clusteredOrders[cluster].push(orderId);
      }
  
      console.log("Clustered Orders:", clusteredOrders);
  
      // 🔹 Step 4: Fetch available users
      const availableUsers = users.filter(user => user.status === "available");
  
      if (availableUsers.length === 0) {
        alert("No available users to assign orders.");
        return;
      }
  
      console.log("Available Users:", availableUsers);
  
      // 🔹 Step 5: Shuffle users for random assignment
      const shuffledUsers = [...availableUsers].sort(() => Math.random() - 0.5);
      let userIndex = 0;
  
      // 🔹 Step 6: Assign each cluster to a courier
      for (const cluster in clusteredOrders) {
        const orderIdsArray = clusteredOrders[cluster];
  
        if (!orderIdsArray || orderIdsArray.length === 0) continue;
  
        const assignedUser = shuffledUsers[userIndex % shuffledUsers.length];
        console.log(`Assigning cluster ${cluster} (Orders: ${orderIdsArray}) to ${assignedUser.name}`);
  
        // 🔹 Step 7: Send assignment to backend
        await axios.put(
          `http://localhost:8000/users/${assignedUser._id}/ordersasaign`,
          { orders: orderIdsArray },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        userIndex++;
      }
  
      alert("Orders assigned successfully!");
    } catch (error) {
      console.error("Error assigning orders:", error);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* Assign Orders Button */}
      <button
        onClick={handleAssignOrders}
        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Assign Orders
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Role: {user.role}</p>
            <p className="text-gray-600">Orders: {user.orders?.length || 0}</p>

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
    </div>
  );
}

export default ManageUsers;
