// Sidebar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons"; // hamburger icon
import "../styles/sidebar.css"; // make sure your CSS defines the drawer behavior

const Sidebar = ({ onSidebarToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const UserType = localStorage.getItem("UserType"); // Get UserType from localStorage

  const handleSidebarToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onSidebarToggle(newState); // Notify parent of the new state
  };

  return (
    <>
      {/* Hamburger Icon */}
      <div
        className={`drawer-toggle ${isOpen ? "open" : ""}`}
        onClick={handleSidebarToggle}
      >
        <FontAwesomeIcon icon={faBars} size="1x" />
      </div>

      {/* Sidebar Drawer */}
      <div className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
        <h2>Dashboard</h2>
        <ul>
          {/* Admin and Official Sidebar Links */}
          {(UserType === "admin" || UserType === "official") && (
            <>
              <li><Link to="/adminhome">Admin Home</Link></li>
              <li><Link to="/addname">Add Name</Link></li>
              <li><Link to="/name">Names</Link></li>
              <li><Link to="/loginname">Account</Link></li>
              <li><Link to="/MyInfo">Other info</Link></li>
              <li><Link to="/cert">Cert</Link></li>
              <li><Link to="/Qr">Qr code</Link></li>
              <li><Link to="/indigent">Indigent</Link></li>
              
            </>
          )}

          {/* User Sidebar Links */}
          {UserType === "user" && (
            <>
              <li><Link to="/userhome">Home</Link></li>
              <li><Link to="/cert">Cert</Link></li>
              <li><Link to="/MyInfo">Other info</Link></li>
            </>
          )}

          {/* Common Link for All User Types */}
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
