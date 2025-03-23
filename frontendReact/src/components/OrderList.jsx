import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found. User is not authenticated.");
        return;
      }

      const response = await axios.get("http://localhost:8000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data._id) {
        setUserId(response.data._id);
      } else {
        console.warn("User data is missing or incomplete.");
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

      if (!orderIds || orderIds.length === 0) {
        console.warn("No orders found for this user.");
        return;
      }

      const orderPromises = orderIds.map((orderId) =>
        axios.get(`http://localhost:8000/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const orderResponses = await Promise.all(orderPromises);
      const fetchedOrders = orderResponses.map((response) => response.data);

      setOrders(fetchedOrders);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8000/orders/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.put(
        `http://localhost:8000/user/${userId}/removeOrder`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "auto",
        padding: "10px",
        borderLeft: "2px solid #ddd",
        background: "#fff",
      }}
    >
      <h3 className="font-bold text-center text-3xl">Your Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
        <div
        key={order._id}
        className="border-4 border-gray-300 p-4 mb-4 rounded-lg bg-gray-100"
        >
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
            <p>
              <strong>Sender Phone:</strong> {order.senderPhone}
            </p>
            <p>
              <strong>Recipient Phone:</strong> {order.recipientPhone}
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
