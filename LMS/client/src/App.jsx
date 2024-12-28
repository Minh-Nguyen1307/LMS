import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Footer from "./Footer/Footer";
import SignUpPage from "./Pages/SignUpPage";
import SignInPage from "./Pages/SignInPage";
import { useEffect, useState } from "react";
import Header from "./Header/Header";
import CoursesPage from "./Pages/CoursesPage";
import Clients from "./Dashboard/Clients/Clients";
import Courses from "./Dashboard/Courses/Courses";
import Communications from "./Dashboard/Communications/Communications";
import Revenues from "./Dashboard/Revenues/Revenues";
import Settings from "./Dashboard/Settings/Settings";
import DashboardPage from "./Pages/DashboardPage";
import PrivateRoute from "./Components/SignIn/PrivateRoute";
import Upload from "./Dashboard/Courses/Upload";
import Home from "./Dashboard/Home/Home";
import Admins from "./Dashboard/Admins/Admins";
import Add from "./Dashboard/Admins/Add";

function App() {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith("/admin-dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);
  return (
    <>
     {!isAdminDashboard && <Header />}
      <Routes>
      {isLoggedIn ? (
          <Route path="/:userId" element={<HomePage />} />
          
        ) : (
          <Route path="/" element={<HomePage />} />
        )}

{isLoggedIn ? (
          <Route path="/:userId/courses" element={<CoursesPage />} />
          
        ) : (
          <Route path="/courses" element={<CoursesPage />} />
        )}

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="/admin-dashboard/*"
          element={
            <PrivateRoute
              allowedRoles={["admin"]}
              element={<DashboardPage />}
            />
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="clients" element={<Clients />} />
          <Route path="admins" element={<Admins />} />
          <Route path="admins/add" element={<Add />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/upload" element={<Upload />} />
          <Route path="communication" element={<Communications />} />
          <Route path="revenue" element={<Revenues />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      {!isAdminDashboard && <Footer />}
    </>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
