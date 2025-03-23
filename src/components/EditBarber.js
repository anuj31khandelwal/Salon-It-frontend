import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditBarber = () => {
  const { salonId } = useParams(); // Get salon ID from URL
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all barbers asynchronously
  const fetchBarbers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/salons/barbers/${salonId}`);
      if (!response.ok) throw new Error("Failed to fetch barbers");
      const data = await response.json();
      setBarbers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update barber status asynchronously
  const updateBarberAvailability = async (barberId, status) => {
    try {
      // Convert "Inactive" to false and "Active" to true
      const isAvailable = status === "Active";
  
      const response = await fetch(`http://localhost:8080/api/salons/${salonId}/updateBarberStatus/${barberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable }), // Send Boolean value
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.text();
      console.log(result);
      alert("Availability updated successfully");
      fetchBarbers(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability");
    }
  };
  
  
  // Remove barber asynchronously
  const removeBarber = async (barberId) => {
    if (!window.confirm("Are you sure you want to remove this barber?")) return;
    try {
      const response = await fetch(`http://localhost:8080/api/salons/${salonId}/barbers/${barberId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove barber");

      alert("Barber removed successfully");
      setBarbers((prev) => prev.filter((barber) => barber.id !== barberId));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, [salonId]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", color:"#808080" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Barbers</h2>

      {loading ? (
        <p>Loading barbers...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#007BFF",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map((barber) => (
              <tr
                key={barber.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <td style={{ padding: "10px" }}>{barber.name}</td>
                <td style={{ padding: "10px" }}>
                  <select
                    value={barber.status}
                    onChange={(e) => updateBarberAvailability(barber.id, e.target.value)}
                    style={{
                      padding: "5px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => removeBarber(barber.id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EditBarber;
