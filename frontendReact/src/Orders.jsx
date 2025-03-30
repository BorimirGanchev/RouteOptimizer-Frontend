import React from "react";
import MapComponent from "./components/MapComponent";
import OrderList from "./components/OrderList"; 

function Orders() {
  return (
    <div className="flex h-[92vh] md:overflow-y-hidden md:flex-row flex-col">
      <div className="flex-1 m-6">
        <MapComponent />
      </div>
      <div className="flex h-[92vh] pt-[60px]" >
        <OrderList />
      </div>

    </div>
  );
}

export default Orders;
