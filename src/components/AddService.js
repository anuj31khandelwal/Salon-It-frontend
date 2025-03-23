import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddService = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([
    { name: "", price: "", duration: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const addServiceField = () => {
    setServices([...services, { name: "", price: "", duration: "" }]);
  };

  const removeServiceField = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      alert("Salon ID is missing!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/salons/${salonId}/addServices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      });

      if (response.ok) {
        alert("Services added successfully!");
        setServices([{ name: "", price: "", duration: "" }]); // Reset form
        navigate(`/SalonDashboard/${salonId}`);
      } else {
        alert("Failed to add services.");
      }
    } catch (error) {
      console.error("Error adding services:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "20px auto",
      padding: "20px",
      background: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Add New Service</h2>
      <form onSubmit={handleSubmit}>
        {services.map((service, index) => (
          <div key={index} style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}>
            <input
              type="text"
              placeholder="Service Name"
              value={service.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <input
              type="number"
              placeholder="Price"
              value={service.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={service.duration}
              onChange={(e) => handleChange(index, "duration", e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeServiceField(index)}
                style={{
                  background: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "block",
                  margin: "auto",
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addServiceField}
          style={{
            width: "100%",
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
            fontSize: "16px",
          }}
        >
          + Add More
        </button>

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#28a745",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddService;
