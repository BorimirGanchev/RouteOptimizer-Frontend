import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "90%",
  height: "70vh",
  position: "flex",
  margin: "auto",
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
  lat: 42.701946,
  lng: 23.344435,
};

const apiHost = import.meta.env.VITE_API_URL ;

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

      const response = await axios.get(`${apiHost}backend/user`, {
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

      const userResponse = await axios.get(`${apiHost}backend/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderIds = userResponse.data.orders;

      if (!orderIds || orderIds.length === 0) {
        console.warn("No orders found for this user.");
        return;
      }

      const orderPromises = orderIds.map(orderId =>
        axios.get(`${apiHost}backend/orders/${orderId}`, {
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
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          draggableCursor: "default",
        }}
      >
        {directionsResult && <DirectionsRenderer directions={directionsResult} />}
      </GoogleMap>

      <div className="bg-gray-200 flex-grow p-2 m-4 mb-4 rounded-4xl shadow-xl mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center p-4">Route Information</h2>
        <div className="flex md:flex-row flex-col md:gap-0 gap-10 justify-between items-center p-4">
          <div className="flex flex-col justify-center items-start text-left">
            {totalDistance && <p className="text-2xl"><strong>Total Distance:</strong> {totalDistance}</p>}
            {totalTime && <p className="text-2xl"><strong>Total Time:</strong> {totalTime}</p>}
          </div>

          <div className="flex justify-center">
            <a
              href={generateGoogleMapsLink()}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border-2 border-[#003B46] p-4 px-5 py-2.5 font-medium text-[#C4DFE6] shadow-md transition duration-300 ease-out"
            >
              <span className="absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-[#003B46] text-white duration-300 group-hover:translate-x-0">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
              <span className="absolute flex h-full w-full transform items-center justify-center text-[#003B46] transition-all duration-300 group-hover:translate-x-full">
                Open in Google Maps
              </span>
              <span className="invisible relative">Open in Google maps</span>
            </a>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
