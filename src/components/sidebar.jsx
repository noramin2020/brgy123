import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../styles/sidebar.css";
import Logo from "../assets/logo1.png";
import axios from "axios";

const Sidebar = ({ onSidebarToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const UserType = localStorage.getItem("UserType");
  const IDNumber = localStorage.getItem("IDNumber");

  useEffect(() => {
    if (!IDNumber) return;

    axios.get(`http://localhost:5000/user/${IDNumber}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const login = res.data[0];
          setfirst_name(login.first_name || "");
          setlast_name(login.last_name || "");
        }
      })
      .catch((err) => {
        console.error("Error fetching issuer data:", err);
      });
  }, [IDNumber]);

  const handleSidebarToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onSidebarToggle(newState);
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
        {/* Logo and Welcome Section */}
        <div className="sidebar-header">
          <img src={Logo} alt="Logo" className="sidebar-logo" />
          <p>Welcome </p>
          <h5><strong>{first_name} {last_name}</strong></h5>
        </div>
        <ul>
          {/* Admin and Official Sidebar Links */}
          {(UserType === "admin" || UserType === "official") && (
            <>
              <li><Link to="/adminhome">Admin Home</Link></li>
              <li><Link to="/addname">Add Name</Link></li>
              <li><Link to="/name">Names</Link></li>
              <li><Link to="/loginname">Account</Link></li>
              <li><Link to="/cert">Cert</Link></li>
              <li><Link to="/indigent">Indigent</Link></li>
              <li><Link to="/Qr">Qr code</Link></li>
            </>
          )}

          {/* User Sidebar Links */}
          {UserType === "user" && (
            <>
              <li><Link to="/userhome">Home</Link></li>
              <li><Link to="/cert">Cert</Link></li>
              <li><Link to="/indigent">Indigent</Link></li>
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
