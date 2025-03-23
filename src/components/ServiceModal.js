import { useState } from "react";

const ServiceModal = ({ isOpen, onClose, onSave, salonId }) => {
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });

  const handleChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/salons/${salonId}/addServices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([serviceData]), // Sending as a list
      });

      if (!response.ok) throw new Error("Failed to add service");

      onSave(serviceData); // Pass data to update UI
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null; // Don't render modal if closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Service</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Service Name:
            <input type="text" name="name" value={serviceData.name} onChange={handleChange} required />
          </label>
          <label>
            Description:
            <input type="text" name="description" value={serviceData.description} onChange={handleChange} />
          </label>
          <label>
            Duration (minutes):
            <input type="number" name="duration" value={serviceData.duration} onChange={handleChange} required />
          </label>
          <label>
            Price ($):
            <input type="number" name="price" value={serviceData.price} onChange={handleChange} required />
          </label>
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
