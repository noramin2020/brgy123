import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/modal.css";

function UpdateLoginModalForm({ isOpen, onClose, loginData, onUpdate }) {
  const [formData, setFormData] = useState({ ...loginData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loginData) setFormData(loginData);
  }, [loginData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate the form data
    if (!formData.IDNumber || !formData.UserType || !formData.Password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    // Optional: Password validation (minimum 8 characters)
    if (formData.Password && formData.Password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/login/update/${formData.id}`, formData);
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
        <h2>Update Login</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-grid">
            {["IDNumber", "UserType", "Password"].map((field) => (
              <div key={field}>
                <label>{field.replace(/_/g, " ")}:</label>
                <input
                  type={field === "Password" ? "password" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
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

export default UpdateLoginModalForm;
