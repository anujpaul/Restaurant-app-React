// src/ReadyOrdersRibbon.js
import React, { useState, useEffect } from "react";
import "./ReadyOrdersRibbon.css"; // Ensure you create this CSS file

const ReadyOrdersRibbon = () => {
  const [readyOrders, setReadyOrders] = useState([]);

  const fetchReadyOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/orderstatus/status/Ready"
      );
      const data = await response.json();
      setReadyOrders(data);
    } catch (error) {
      console.error("Error fetching ready orders", error);
    }
  };

  useEffect(() => {
    fetchReadyOrders();
  }, []);

  return (
    <div className="ready-orders-ribbon">
      <h2>Ready Orders</h2>
      {readyOrders.length > 0 ? (
        <div className="ribbon-content">
          {readyOrders.map((order) => (
            <div key={order.orderNumber} className="ribbon-item">
              <span>Order Number: {order.orderNumber}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No ready orders at the moment.</p>
      )}
    </div>
  );
};

export default ReadyOrdersRibbon;
