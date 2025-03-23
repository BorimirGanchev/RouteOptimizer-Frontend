import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "70vh",
};

const center = {
  lat: 42.701946,
  lng: 23.344435,
};

const MapComponent = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [directionsResult, setDirectionsResult] = useState(null);
  const [totalDistance, setTotalDistance] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserOrders();
    }
  }, [userId]);

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

      const orderPromises = orderIds.map(orderId =>
        axios.get(`http://localhost:8000/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const orderResponses = await Promise.all(orderPromises);
      const orders = orderResponses.map(response => response.data);

      const recipientAddresses = orders.map(order => order.recipientAddress);
      setWaypoints(recipientAddresses);

      if (recipientAddresses.length === 0) {
        console.warn("No recipient addresses found.");
        return;
      }

      calculateRoute(recipientAddresses);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const calculateRoute = (addresses) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const destination = "42.7000, 23.3200"; 

    const waypoints = addresses.map(address => ({
      location: address,
      stopover: true,
    }));

    directionsService.route(
      {
        origin: destination, 
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResult(result);

          let totalDistanceValue = 0;
          let totalTimeValue = 0;

          result.routes[0].legs.forEach((leg) => {
            totalDistanceValue += leg.distance.value;
            totalTimeValue += leg.duration.value;
          });

          setTotalDistance((totalDistanceValue / 1000).toFixed(2) + " km");
          setTotalTime((totalTimeValue / 60).toFixed(2) + " mins");
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  const generateGoogleMapsLink = () => {
    const baseUrl = "https://www.google.com/maps/dir/?api=1";

    const destination = "42.7000, 23.3200"; 

    const waypointsParam = waypoints.map(encodeURIComponent).join("|");

    return `${baseUrl}&destination=${encodeURIComponent(destination)}&waypoints=${waypointsParam}&travelmode=driving`;
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={6}
      >
        {directionsResult && <DirectionsRenderer directions={directionsResult} />}
      </GoogleMap>

      <div className="bg-gray-200 h-full flex-grow p-4">
        <div className="flex flex-row gap-50 justify-center items-center">
          {totalDistance && <p className="text-2xl"><strong>Total Distance:</strong> {totalDistance}</p>}
          {totalTime && <p className="text-2xl"><strong>Total Time:</strong> {totalTime}</p>}
        </div>

        <div className="flex justify-center mt-10">
          <a
            href={generateGoogleMapsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
