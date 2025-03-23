import React, { useState } from "react";
import { useParams } from "react-router-dom";

const AddBarber = () => {
    const { salonId } = useParams(); 
  const [barberId, setBarberId] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const barberData = {
        salon: { id: salonId.toString() }, // Convert to string to match expected format
        id: barberId.toString(),
        name: name,
        rating: rating.toString(),
        isAvailable: isAvailable, // Send as "1" or "0"
      };

    try {
      const response = await fetch(`http://localhost:8080/api/salons/${salonId}/addBarber`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(barberData),
      });

      if (response.ok) {
        setMessage("Barber added successfully!");
      } else {
        const errorText = await response.text();
        setMessage(`Failed to add barber: ${errorText}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Barber</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Barber ID:</label>
        <input
          type="text"
          value={barberId}
          onChange={(e) => setBarberId(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Rating:</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          min="0"
          max="5"
          step="0.1"
          style={styles.input}
        />

        <label style={styles.label}>Availability:</label>
        <select
          value={isAvailable ? "1" : "0"}
          onChange={(e) => setIsAvailable(e.target.value === "true")}
          style={styles.select}
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        <button type="submit" style={styles.button}>Add Barber</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  title: {
    marginBottom: "15px",
    color: "#333",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  select: {
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    fontWeight: "bold",
    color: "green",
  },
};

export default AddBarber;
