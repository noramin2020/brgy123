import React, { useState, useEffect } from "react";

function CinfoModal({ isOpen, onClose, onAdd, initialData }) {
  const [formData, setFormData] = useState({
    gmail: "",
    c_no: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        gmail: initialData.gmail || "",
        c_no: initialData.c_no || "",
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
        <h2>{initialData ? "Update" : "Add"} Civil Information</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Gmail:
              <input
                type="text"
                name="gmail"
                value={formData.gmail}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Contact No.:
              <input
                type="text"
                name="c_no"
                value={formData.c_no}
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

export default CinfoModal;
