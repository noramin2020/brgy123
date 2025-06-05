import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateLoginModalForm from "../Modal/UpdateLoginModalForm"; // Adjust path if needed
import "../styles/pages.css"; // Import the shared CSS styles

function LoginRecordsPage({ isSidebarOpen }) {
  const [logins, setLogins] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogins();
  }, []);

  const fetchLogins = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://brgyback.onrender.com/loginview");
      setLogins(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch login data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setSelectedLogin(row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedLogin(null);
  };

  const handleUpdate = () => {
    fetchLogins(); // Refresh the data after updating
  };

  return (
    <div className={`records-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <h2>Login Records</h2>
      {loading ? (
        <p>Loading...</p> 
      ) : logins.length === 0 ? (
        <p>No login records available.</p> // Display if no records are found
      ) : (
        <table className="login-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Number</th>
              <th>User Type</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logins.map((row) => (
              <tr key={row.id || row.IDNumber}> {/* Ensure a unique key */}
                <td>{row.id}</td>
                <td>{row.IDNumber}</td>
                <td>{row.UserType}</td>
                <td>{row.Password}</td> {/* Masking the password for security */}
                <td>
                  <button onClick={() => handleEdit(row)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Updating */}
      <UpdateLoginModalForm
        isOpen={modalOpen}
        onClose={handleModalClose}
        loginData={selectedLogin}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default LoginRecordsPage;
