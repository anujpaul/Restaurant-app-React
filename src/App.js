// src/App.js
import React from "react";
import CreateOrder from "./CreateOrder";
import OrderStatus from "./OrderStatus";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Restaurant Ordering System</h1>
      <CreateOrder />
      <hr />
      <OrderStatus />
    </div>
  );
}

export default App;
