import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import LoginImg from "../assets/login.jpg";
import Logo from "../assets/logo.png";
import LoadingIcon from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    IDNumber: "",
    UserType: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "UserType") {
      // Handle checkboxes for UserType (only one should be selected)
      setFormData((prev) => ({
        ...prev,
        UserType: checked ? value : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(false); // Reset login error state on each submit

    // Simulate loading delay of 5 to 10 seconds (can be removed in production)
    const delay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

    setTimeout(async () => {
      try {
        const response = await fetch("https://brgyback.onrender.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Login success, redirect immediately without any alerts
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("IDNumber", data.user.IDNumber);
          localStorage.setItem("UserType", data.user.UserType);

          // Redirect based on usertype
          switch (data.user.UserType) {
            case "official":
              navigate("/adminhome");
              break;
            case "user":
              navigate("/userhome");
              break;
            case "admin":
              navigate("/adminhome");
              break;
            default:
              // Handle case if the usertype is unknown
              navigate("/error");
              break;
          }
        } else {
          // Login failed, show error and stop the spinner
          setLoginError(true);
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred. Please try again.");
        setLoginError(true);
      } finally {
        setLoading(false);
      }
    }, delay);
  };

  return (
    <div className={`login-container ${loading ? "loading-active" : ""}`}>
      <div className="login-box">
        <div className="login-left">
          <img src={LoginImg} alt="Login Visual" />
        </div>

        <div className="login-right">
          <img src={Logo} alt="Logo" className="login-logo" />
          <h2>Rorogagus East, Marawi City</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>ID Number:</label>
              <input
                type="text"
                name="IDNumber"
                value={formData.IDNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
  <label>User Type:</label>
  <div className="checkbox-group">
    <div>
      <input
        type="checkbox"
        name="UserType"
        value="admin"
        checked={formData.UserType === "admin"}
        onChange={handleChange}
      />
      <label>Admin</label>
    </div>
    <div>
      <input
        type="checkbox"
        name="UserType"
        value="official"
        checked={formData.UserType === "official"}
        onChange={handleChange}
      />
      <label>Official</label>
    </div>
    <div>
      <input
        type="checkbox"
        name="UserType"
        value="user"
        checked={formData.UserType === "user"}
        onChange={handleChange}
      />
      <label>User</label>
    </div>
  </div>
</div>


            {loading ? (
              <div className="loading-wrapper">
                <img src={LoadingIcon} alt="Loading..." className="loading-icon" />
                <p>Loading...</p>
              </div>
            ) : (
              <button type="submit">Login</button>
            )}
          </form>

          {/* Error Popup below the spinner */}
          {loginError && !loading && (
            <div className="error-popup">
              <p>Invalid credentials. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
