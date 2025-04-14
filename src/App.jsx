// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Name from "./pages/name";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import ProtectedRoute from "./ProtectedRoute";
import SidebarLayout from "./components/sidebarLayout"; // Make sure to use your layout component
import ViewDataLogin from "./pages/LoginRecordsPage";
import ViewData from "./pages/NameRecordsPage";
import InfoUpdate from "./pages/user/InfoUpdate";
import Cert from "./pages/cert";
import Qr from "./pages/DecryptPage";
import Indigent from "./pages/indigent";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin and Official Route */}
        <Route
          path="/adminhome"
          element={
            <ProtectedRoute requiredUsertype="official">
              <SidebarLayout>
                <AdminHome />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        {/* User Route */}
        <Route
          path="/userhome"
          element={
            <ProtectedRoute requiredUsertype="user">
              <SidebarLayout>
                <UserHome />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute requiredUsertype="official">
              <SidebarLayout>
                <Home />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/addname"
          element={
            <ProtectedRoute requiredUsertype="official">
              <SidebarLayout>
                <Name />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/name"
          element={
            <ProtectedRoute requiredUsertype="official">
              <SidebarLayout>
                <ViewData />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/loginname"
          element={
            <ProtectedRoute requiredUsertype="official">
              <SidebarLayout>
                <ViewDataLogin />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/MyInfo"
          element={
            // Here, requiredUsertype="any" is used to let all user types access this route
            <ProtectedRoute requiredUsertype="any">
              <SidebarLayout>
                <InfoUpdate />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cert"
          element={
            // Here, requiredUsertype="any" is used to let all user types access this route
            <ProtectedRoute requiredUsertype="any">
              <SidebarLayout>
                <Cert />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Qr"
          element={
            // Here, requiredUsertype="any" is used to let all user types access this route
            <ProtectedRoute requiredUsertype="any">
              <SidebarLayout>
                <Qr />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/indigent"
          element={
            <ProtectedRoute requiredUsertype="any">
              <SidebarLayout>
                <Indigent />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
