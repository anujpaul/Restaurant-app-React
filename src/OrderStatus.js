import React, { useState, useEffect } from "react";

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [orderId, setOrderId] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/orderstatus");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching order status", error);
    }
  };

  const fetchOrderById = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/orderstatus/${orderId}`
      );
      const data = await response.json();
      setOrders([data]);
    } catch (error) {
      console.error("Error fetching order by ID", error);
    }
  };

  const fetchOrdersByStatus = async (status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/orderstatus/status/${status}`
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders by status", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Order deleted successfully");
        // Refresh the order list after deletion
        fetchOrders();
      } else {
        alert("Error deleting order");
      }
    } catch (error) {
      console.error("Error deleting order", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="order-status">
      <div className="button-container">
        <button onClick={fetchOrders}>Get All Orders</button>
        <button onClick={() => fetchOrdersByStatus("New")}>New Orders</button>
        <button onClick={() => fetchOrdersByStatus("In_Progress")}>
          In Progress Orders
        </button>
        <button onClick={() => fetchOrdersByStatus("Ready")}>
          Ready Orders
        </button>
        <button onClick={() => fetchOrdersByStatus("Completed")}>
          Completed Orders
        </button>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
        />
        <button onClick={fetchOrderById}>Get Order By ID</button>
      </div>
      <div className="order-list">
        {orders.length > 0 &&
          orders.map((order) => (
            <div key={order.orderNumber} className="order-box">
              <h3>Order Number: {order.orderNumber}</h3>
              <p>Status: {order.status}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
              <ul>
                {order.orderItems &&
                  order.orderItems.map((item) =>
                    item.itemTable ? (
                      <li key={item.id}>
                        <strong>{item.itemTable.itemName}</strong>:{" "}
                        {item.quantity} @ ${item.itemTable.amount} each
                      </li>
                    ) : (
                      <li key={item.id}>Item details not available</li>
                    )
                  )}
              </ul>
              <button
                className="delete-button"
                onClick={() => deleteOrder(order.orderNumber)}
              >
                Delete Order
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderStatus;
