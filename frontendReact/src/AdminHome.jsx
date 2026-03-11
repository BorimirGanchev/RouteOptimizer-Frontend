import React, { useEffect, useState } from "react";
import bgImage from './assets/bgImage.jpg';
import clock from './assets/clock (1).png';
import equal from './assets/equal-mathematical-sign (1).png';
import happy from './assets/happy (1).png';
import route from './assets/route (1).png';
import money from './assets/save-money (2).png';
import scales from './assets/scales-of-justice (1).png';

function AdminHome() {
  // const [userName, setUserName] = useState("");

  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get("http://localhost:8000/user", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setUserName(response.data.name);
  //     } catch (error) {
  //       console.error("Error fetching user name:", error);
  //     }
  //   };

  //   fetchUserName();
  // }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div
        className="relative w-full min-h-[66vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 z-1 gap-5 flex flex-col items-start justify-center px-8 md:pl-36">
          <h1 className="text-white text-4xl md:text-6xl font-bold max-w-xl lg:whitespace-nowrap">
            PROVIDING THE HIGHEST
          </h1>
          <h6 className="text-white text-2xl md:text-4xl font-bold max-w-xl">
            quality service 24 hours a day
          </h6>
          <p className="text-white text-lg md:text-xl max-w-xl">
            An innovative business solution for courier companies, which aims to ensure faster and more efficient delivery of shipments to end users.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-10 w-full max-w-7xl p-10 mx-auto text-center">
        <div className="p-4 flex flex-col gap-5 items-center justify-center">
          <img src={route} alt="Route" className="w-16 h-16" />
          <p className="text-2xl font-bold text-gray-800">Optimal</p>
          <p className="text-lg font-medium text-gray-800">
            Calculates the most optimal route for delivering shipments.
          </p>
        </div>

        <div className="p-4 flex flex-col gap-5 items-center justify-center">
          <img src={scales} alt="Scales" className="w-16 h-16" />
          <p className="text-2xl font-bold text-gray-800">Fairly</p>
          <p className="text-lg font-medium text-gray-800">
            Distributes shipments efficiently and fairly between couriers.
          </p>
        </div>

        <div className="p-4 flex flex-col gap-5 items-center justify-center">
          <img src={equal} alt="Equal" className="w-16 h-16" />
          <p className="text-2xl font-bold text-gray-800">Uniform</p>
          <p className="text-lg font-medium text-gray-800">
            Guarantees uniform loading/use of courier vehicles.
          </p>
        </div>

        <div className="p-4 flex flex-col gap-5 items-center justify-center">
          <img src={clock} alt="Clock" className="w-16 h-16" />
          <p className="text-2xl font-bold text-gray-800">Efficient</p>
          <p className="text-lg font-medium text-gray-800">
            Shortens delivery times.
          </p>
        </div>

        <div className="p-4 flex flex-col gap-5 items-center justify-center">
          <img src={happy} alt="Happy" className="w-16 h-16" />
          <p className="text-2xl font-bold text-gray-800">Experience</p>
          <p className="text-lg font-medium text-gray-800">
            Improves customer experience and courier image/branding.
          </p>
        </div>

        <div className="p-4 flex flex-col gap-5 items-center justify-center">
          <img src={money} alt="Money" className="w-16 h-16" />
          <p className="text-2xl font-bold text-gray-800">Saving</p>
          <p className="text-lg font-medium text-gray-800">Save money!</p>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
