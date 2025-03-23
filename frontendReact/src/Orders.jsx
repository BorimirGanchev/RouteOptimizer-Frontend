import React from "react";
import MapComponent from "./components/MapComponent";
import OrderList from "./components/OrderList"; 

function Orders() {
  return (
    <div style={{ display: "flex", height: "100vh" , overflow: "hidden", paddingTop: "7vh" }}>
      <div style={{ flex: 1 }}>
        <MapComponent />
      </div>
      <div style={{ display: "flex", height: "100vh" }}>
        <OrderList />
      </div>

    </div>
  );
}

export default Orders;
