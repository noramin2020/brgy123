// SidebarLayout.jsx
import { useState } from "react";
import Sidebar from "./sidebar";

function SidebarLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar onSidebarToggle={setIsSidebarOpen} />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          transition: "margin-left 0.3s ease",
          // Adjust the margin-left based on the sidebar's state.
          // For example, 250px when open, 80px when closed. Adjust these values to match your design.
          marginLeft: isSidebarOpen ? "250px" : "80px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default SidebarLayout;
