const ProtectedRoute = ({ requiredUsertype, children }) => {
  const userType = localStorage.getItem("UserType");

  // If requiredUsertype is "any", allow all user types
  if (requiredUsertype !== "any" && userType !== requiredUsertype) {
    // Redirect to login page if the user type does not match
    return <Navigate to="/" />;
  }

  return children; // Render the child components if the user is authorized
};

export default ProtectedRoute;
