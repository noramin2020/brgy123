import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateModalForm from "../Modal/UpdateUserModalForm";
import "../styles/pages.css"; // Import the unified styles

function NameRecordsPage({ isSidebarOpen }) {
  const [names, setNames] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      const response = await axios.get("http://localhost:5000/name");
      setNames(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch names.");
    }
  };

  const handleEdit = (row) => {
    setSelectedUser(row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdate = () => {
    fetchNames(); // Refresh the data after updating
  };

  return (
    <div className={`records-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <h2>Name Records</h2>
      <table className="records-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Middle</th>
            <th>Last</th>
            <th>Extension</th>
            <th>Position</th>
            <th>House No</th>
            <th>Zone</th>
            <th>Resident Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {names.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.first_name}</td>
              <td>{row.middle_name}</td>
              <td>{row.last_name}</td>
              <td>{row.extension}</td>
              <td>{row.Position}</td>
              <td>{row.HouseNo}</td>
              <td>{row.ZoneNo}</td>
              <td>{row.ResidentType}</td>
              <td>
                <button onClick={() => handleEdit(row)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Updating */}
      <UpdateModalForm
        isOpen={modalOpen}
        onClose={handleModalClose}
        userData={selectedUser}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default NameRecordsPage;
