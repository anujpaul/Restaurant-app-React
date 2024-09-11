import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the app root for accessibility

function CreateOrder() {
  const [menu, setMenu] = useState([]); // Store menu items
  const [orderItems, setOrderItems] = useState([{ itemId: "", quantity: 1 }]);
  const [statusMessage, setStatusMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Fetch the menu from the API
  const fetchMenu = async () => {
    try {
      const response = await fetch("http://localhost:8080/menu");
      const data = await response.json();
      setMenu(data); // Set menu data in state
    } catch (error) {
      console.error("Error fetching menu", error);
    }
  };

  useEffect(() => {
    fetchMenu(); // Fetch menu when component loads
  }, []);

  const handleInputChange = (index, event) => {
    const values = [...orderItems];
    values[index][event.target.name] = event.target.value;
    setOrderItems(values);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { itemId: "", quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      status: "New",
      orderItems: orderItems.map((item) => ({
        itemTable: {
          id: item.itemId, // Use selected itemId from dropdown
        },
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:8080/createorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Error creating order");
      }

      const data = await response.text(); // Assuming the API returns a plain text message
      setStatusMessage(`Order Created: ${data}`);
      setModalIsOpen(true); // Open modal when order is created
    } catch (error) {
      setStatusMessage("Error creating order");
      setModalIsOpen(true); // Open modal on error
    }
  };

  return (
    <div>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        {orderItems.map((item, index) => (
          <div key={index}>
            <select
              name="itemId"
              value={item.itemId}
              onChange={(event) => handleInputChange(index, event)}
              required
            >
              <option value="">Select Item</option>
              {menu.map((menuItem) => (
                <option key={menuItem.id} value={menuItem.id}>
                  {menuItem.itemName} - ${menuItem.amount}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Quantity"
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          Add Another Item
        </button>
        <button type="submit">Submit Order</button>
      </form>

      {/* Modal for displaying the status message */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Status Message"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            backgroundColor: "#f9f9f9", // Light background color
            color: "#333", // Dark text color
            padding: "20px",
            borderRadius: "10px",
            width: "300px", // Set width to be smaller
            maxWidth: "90%", // Responsive width
            margin: "auto", // Center horizontally
            top: "30%", // Position vertically
            left: "50%",
            transform: "translate(-50%, -30%)", // Center both horizontally and vertically
            border: "2px solid #6200ea", // Purple border color
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Shadow effect
          },
        }}
      >
        <h2>Status</h2>
        <p>{statusMessage}</p>
        <button
          onClick={() => setModalIsOpen(false)}
          style={{
            backgroundColor: "#6200ea", // Purple button
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default CreateOrder;
