import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {

  
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    navigate("/"); // Redirect to login
  }, [navigate]);

  return null;
}

export default Logout;
