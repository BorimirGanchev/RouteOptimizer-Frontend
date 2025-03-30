import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:8000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data._id) {
        setUserId(response.data._id);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!userId) return;

      const userResponse = await axios.get(`http://localhost:8000/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderIds = userResponse.data.orders;
      if (!orderIds || orderIds.length === 0) return;

      const orderPromises = orderIds.map((orderId) =>
        axios.get(`http://localhost:8000/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const orderResponses = await Promise.all(orderPromises);
      const fetchedOrders = orderResponses.map((response) => response.data);

      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserOrders();
    }
  }, [userId]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const handleCallClick = (phone) => {
    navigator.clipboard.writeText(phone); // Copy to clipboard
    window.location.href = `tel:${phone}`; // Open phone app
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-100vh overflow-y-auto p-10 border-l-2 border-gray-300 bg-white w-full">
      <h3 className="font-bold text-center text-3xl">Your Orders</h3>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 my-4 border rounded-lg"
      />

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order._id} className="border-4 border-gray-300 p-4 mb-4 rounded-lg bg-gray-100">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Full Name:</strong> {order.fullName}
            </p>
            <p>
              <strong>From:</strong> {order.senderAddress}
            </p>
            <p>
              <strong>To:</strong> {order.recipientAddress}
            </p>
            <p className="flex items-center">
              <strong>Sender Phone:</strong> {order.senderPhone}
              <button
                onClick={() => handleCallClick(order.senderPhone)}
                className="ml-2 bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-600"
              >
                <ion-icon name="call"></ion-icon>
              </button>
            </p>
            <p className="flex items-center">
              <strong>Recipient Phone:</strong> {order.recipientPhone}
              <button
                onClick={() => handleCallClick(order.recipientPhone)}
                className="ml-2 bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-600"
              >
                <ion-icon name="call"></ion-icon>
              </button>
            </p>
            <p>
              <strong>Order Status:</strong> {order.orderStatus}
            </p>
            <p>
              <strong>Order Price:</strong> ${order.orderPrice}
            </p>

            <div>
              <button
                onClick={() => updateOrderStatus(order._id, "completed")}
                className="mr-2 bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600"
              >
                Complete
              </button>
              <button
                onClick={() => updateOrderStatus(order._id, "postponed")}
                className="mr-2 bg-orange-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-orange-600"
              >
                Postpone
              </button>
              <button
                onClick={() => updateOrderStatus(order._id, "canceled")}
                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
