import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditServices = () => {
  const { salonId } = useParams();
  const [services, setServices] = useState([]);

  // Fetch all services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/salons/${salonId}/services`);
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [salonId]);

  // Handle input change for price and duration
  const handleInputChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  // Save edited service (PUT request)
  const saveService = async (index) => {
    const service = services[index];

    try {
      const response = await fetch(`http://localhost:8080/api/salons/${salonId}/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: service.name, // Name remains unchanged
          price: service.price,
          duration: service.duration,
        }),
      });

      if (response.ok) {
        alert("Service updated successfully!");
      } else {
        alert("Failed to update service.");
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  // Delete a service (DELETE request)
  const deleteService = async (index) => {
    const service = services[index];

    if (!window.confirm(`Are you sure you want to delete ${service.name}?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/salons/${salonId}/services/${service.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Service deleted successfully!");
        setServices(services.filter((_, i) => i !== index)); // Remove from UI
      } else {
        alert("Failed to delete service.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Services</h2>

      {services.length === 0 ? (
        <p style={{ textAlign: "center" }}>No services available.</p>
      ) : (
        services.map((service, index) => (
          <div key={service.id} style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "15px",
          }}>
            <h3 style={{ marginBottom: "10px", color: "#333" }}>{service.name}</h3>
            
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px",color: "#080808" }}>Price</label>
            <input
              type="number"
              value={service.price}
              onChange={(e) => handleInputChange(index, "price", e.target.value)}
              placeholder="Price"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />

            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" ,color: "#080808"}}>Duration (minutes)</label>
            <input
              type="number"
              value={service.duration}
              onChange={(e) => handleInputChange(index, "duration", e.target.value)}
              placeholder="Duration (minutes)"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => saveService(index)}
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  flex: 1,
                  marginRight: "5px",
                }}
              >
                Save
              </button>
              <button
                onClick={() => deleteService(index)}
                style={{
                  background: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  flex: 1,
                  marginLeft: "5px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EditServices;
