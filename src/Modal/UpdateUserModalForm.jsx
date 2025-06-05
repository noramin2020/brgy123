import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/modal.css";

function UpdateUserModalForm({ isOpen, onClose, userData, onUpdate }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    extension: "",
    Position: "",
    ResidentType: "",
    HouseNo: "",
    ZoneNo: "",
    id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        middle_name: userData.middle_name || "",
        last_name: userData.last_name || "",
        extension: userData.extension || "",
        Position: userData.Position || "",
        ResidentType: userData.ResidentType || "",
        HouseNo: userData.HouseNo || "",
        ZoneNo: userData.ZoneNo || "",
        id: userData.id || ""  // Ensure Id is properly set
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate the form data
    if (!formData.first_name || !formData.last_name || !formData.Position || !formData.ResidentType) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(`https://brgyback.onrender.com/name/update/${formData.id}`, formData);
      alert(res.data.message);
      onUpdate(); // refresh or callback
      onClose();  // close modal
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update User</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-grid">
            {["first_name", "middle_name", "last_name", "extension", "Position"].map((field) => (
              <div key={field}>
                <label>{field.replace(/_/g, " ")}:</label>
                <input
                  type={field === "Password" ? "password" : "text"}
                  name={field}
                  value={formData[field] || ""}  // Ensure default value if undefined
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div>
              <label>Resident Type:</label>
              <select
                name="ResidentType"
                value={formData.ResidentType || ""}  // Ensure default value if undefined
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Temporary">Temporary</option>
                <option value="Permanent">Permanent</option>
                <option value="Native">Native</option>
              </select>
            </div>
            <div>
              <label>House No:</label>
              <input
                type="number"
                name="HouseNo"
                value={formData.HouseNo || ""}  // Ensure default value if undefined
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Zone No:</label>
              <select
                name="ZoneNo"
                value={formData.ZoneNo || ""}  // Ensure default value if undefined
                onChange={handleChange}
                required
              >
                <option value="">Select Zone</option>
                <option value="1">Zone 1</option>
                <option value="2">Zone 2</option>
              </select>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUserModalForm;
