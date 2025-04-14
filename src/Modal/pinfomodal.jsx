import React, { useState, useEffect } from "react";

function PinfoModal({ isOpen, onClose, onAdd, initialData }) {
  const [formData, setFormData] = useState({
    gender: "",
    c_status: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        gender: initialData.gender || "",
        c_status: initialData.c_status || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? "Update" : "Add"} Personal Information</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Gender:
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Civil Status:
              <input
                type="text"
                name="c_status"
                value={formData.c_status}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="modal-buttons">
            <button type="submit">{initialData ? "Update" : "Add"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PinfoModal;
