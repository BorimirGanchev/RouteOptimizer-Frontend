import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminHome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold">
      <span role="img" aria-label="wave">
          👋
        </span>{" "}
        {userName ? `Hello, ${userName}!` : ""}
      </h1>
      {/* <p className="text-2xl text-gray-600 mt-2">Slack is a messaging app for teams.</p> */}
    </div>
  );
}

export default AdminHome;
