import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const apiHost = import.meta.env.VITE_API_HOST || "http://localhost:8000";

const NewOrder = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    senderAddress: null,
    recipientAddress: null,
    senderPhone: "",
    recipientPhone: "",
    orderPrice: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.fullName || !formData.senderAddress || !formData.recipientAddress || !formData.senderPhone || !formData.recipientPhone || !formData.orderPrice) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const orderData = {
        fullName: formData.fullName,
        senderAddress: formData.senderAddress.label,  
        recipientAddress: formData.recipientAddress.label,
        senderPhone: formData.senderPhone,
        recipientPhone: formData.recipientPhone,
        orderPrice: formData.orderPrice,
      };
  
      const response = await axios.post(`${apiHost}/create`, orderData, {
        headers: { "Content-Type": "application/json" },
      });
  
      alert("Order created successfully!");
      navigate("/admin-home"); 
  
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create order. Please try again.");
    }
  };
  

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
  
          <GooglePlacesAutocomplete
            selectProps={{
              placeholder: "Sender Address",
              value: formData.senderAddress,
              onChange: (place) => setFormData({ ...formData, senderAddress: place }),
              styles: { menu: (provided) => ({ ...provided, zIndex: 9999 }) },
            }}
          />
  
          <input
            type="tel"
            name="senderPhone"
            placeholder="Sender Phone"
            value={formData.senderPhone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
  
          <GooglePlacesAutocomplete
            selectProps={{
              placeholder: "Recipient Address",
              value: formData.recipientAddress,
              onChange: (place) => setFormData({ ...formData, recipientAddress: place }),
              styles: { menu: (provided) => ({ ...provided, zIndex: 9999 }) },
            }}
          />
  
          <input
            type="tel"
            name="recipientPhone"
            placeholder="Recipient Phone"
            value={formData.recipientPhone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
  
          <input
            type="number"
            name="orderPrice"
            placeholder="Order Price"
            value={formData.orderPrice}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
  
          <button type="submit" className="mb-4 px-8 py-4 text-white font-bold rounded-md hover:opacity-90 bg-gradient-to-r from-black to-red-500">
            Create Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;
