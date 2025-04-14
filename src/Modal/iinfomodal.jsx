import React, { useState, useEffect } from "react";

function IinfoModal({ isOpen, onClose, onAdd, initialData }) {
  const [formData, setFormData] = useState({
    occupation: "",
    fmi: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        occupation: initialData.occupation || "",
        fmi: initialData.fmi || "",
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
        <h2>{initialData ? "Update" : "Add"} Income Information</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Occupation:
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              FMI:
              <input
                type="text"
                name="fmi"
                value={formData.fmi}
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

export default IinfoModal;
