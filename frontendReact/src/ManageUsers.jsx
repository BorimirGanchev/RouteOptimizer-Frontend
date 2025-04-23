import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "70%",
  height: "500px",
  borderRadius: "2rem",
  overflow: "hidden",
};

const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1d2c4d" }]
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8ec3b9" }]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a3646" }]
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4b6878" }]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64779e" }]
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334e87" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f9ba5" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#023e58" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3C7680" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#304a7d" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }]
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }]
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }]
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [{ color: "#283d6a" }]
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#3a4762" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e6d70" }]
  }
];

const center = {
  lat: 0,
  lng: 0,
};

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [mapCenter, setMapCenter] = useState(center);
  const apiHost = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
  });

  useEffect(() => {
    let intervalId;
  
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiHost}/backend/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Host:", apiHost);
        console.log("Full API Response:", response); 
        const filtered = response.data.filter(
          (user) => user.location?.lat !== null && user.location?.lng !== null
        );
  
        setUsers(filtered);
  
        if (filtered.length) {
          setMapCenter({
            lat: filtered[0].location.lat,
            lng: filtered[0].location.lng,
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers(); 

    intervalId = setInterval(fetchUsers, 30000);
  
    return () => clearInterval(intervalId); 
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiHost}/backend/users/${userId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteClick = async (user) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${user.name}?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiHost}/backend/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAssignOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const ordersResponse = await axios.get(`${apiHost}/backend/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderAssignment = ordersResponse.data;
      if (!orderAssignment || Object.keys(orderAssignment).length === 0) {
        alert("No valid orders for deployment.");
        return;
      }

      const clusteredOrders = {};
      for (const [orderId, cluster] of Object.entries(orderAssignment)) {
        if (!clusteredOrders[cluster]) clusteredOrders[cluster] = [];
        clusteredOrders[cluster].push(orderId);
      }

      const availableUsers = users.filter(user => user.status === "available");
      if (!availableUsers.length) {
        alert("No available users to assign orders.");
        return;
      }

      const shuffledUsers = [...availableUsers].sort(() => Math.random() - 0.5);
      let userIndex = 0;

      for (const cluster in clusteredOrders) {
        const orderIdsArray = clusteredOrders[cluster];
        if (!orderIdsArray.length) continue;

        const assignedUser = shuffledUsers[userIndex % shuffledUsers.length];

        await axios.put(
          `${apiHost}/backend/users/${assignedUser._id}/ordersasaign`,
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
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Manage Users</h1>
      
      {!isLoaded || users.length === 0 ? (
        <>
          <p className="text-gray-500">Loading map or no users available...</p>
        </>
      ) : (
        <div className="flex justify-center items-center w-full mb-6">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={12}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true,
              zoomControl: true,
              gestureHandling: "greedy",
              draggableCursor: "default",
            }}
          >
            {users.map((user) => (
              <Marker
                key={user._id}
                position={{ lat: user.location.lat, lng: user.location.lng }}
                label={{
                  text: user.name,
                  color: "white", 
                  fontSize: "14px", 
                  fontWeight: "bold", 
                }}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png", 
                  scaledSize: new window.google.maps.Size(80, 80), 
                }}
              />
            ))}
          </GoogleMap>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl px-2">
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-600 text-sm">Email: {user.email}</p>
            <p className="text-gray-600 text-sm">Orders: {user.orders?.length || 0}</p>

            <div className="mt-2">
              <label className="text-sm font-medium">Status:</label>
              <select
                className={`ml-2 p-1 rounded-md text-sm ${
                  user.status === "available" ? "bg-green-200" : "bg-red-200"
                }`}
                value={user.status}
                onChange={(e) => handleStatusChange(user._id, e.target.value)}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <button
              onClick={() => handleDeleteClick(user)}
              className="mt-3 bg-red-500 text-white text-sm px-3 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
        
      </div>
      <button
        onClick={handleAssignOrders}
        className="mb-4 mt-4 px-8 py-4 text-white font-bold rounded-md hover:opacity-90 bg-gradient-to-r from-black to-red-500"
      >
        Assign Orders
      </button>
    </div>
  );
}

export default ManageUsers;
