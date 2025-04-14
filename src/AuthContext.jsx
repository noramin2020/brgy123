import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [UserType, setUserType] = useState(localStorage.getItem("UserType") || "");

  const login = (UserType) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("UserType", UserType);
    setLoggedIn(true);
    setUserType(UserType);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("UserType");
    setLoggedIn(false);
    setUserType("");
  };

  return (
    <AuthContext.Provider value={{ loggedIn, UserType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
