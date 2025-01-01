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
import Communications from "./Dashboard/Communications/Communications";
import Revenues from "./Dashboard/Revenues/Revenues";
import Settings from "./Dashboard/Settings/Settings";
import DashboardPage from "./Pages/DashboardPage";
import PrivateRoute from "./Components/SignIn/PrivateRoute";
import Upload from "./Dashboard/Courses/Upload/Upload";
import Home from "./Dashboard/Home/Home";
import Admins from "./Dashboard/Admins/Admins";
import Add from "./Dashboard/Admins/Add";
import CourseDetailPage from "./Pages/CourseDetailPage";
import CartPage from "./Pages/CartPage";
import CoursesTable from "./Dashboard/Courses/Courses";
import Update from "./Dashboard/Courses/Update/Update";
import ProfilePage from "./Pages/ProfilePage";
import Edit from "./Components/Profile/Edit/Edit";
import Purchased from "./Components/Profile/Purchased/Purchased";
import PaymentPage from "./Pages/PaymentPage";



function App() {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith("/admin-dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isProfilePage = location.pathname.match(/^\/[^/]+\/profile/);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);
  return (
    <>
     {!isAdminDashboard && !isProfilePage && <Header />}
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

{isLoggedIn && (
  <>
    <Route path="/:userId/courses/:courseId" element={<CourseDetailPage />} />
    <Route path="/:userId/cart" element={<CartPage />} />
    <Route path="/complete-order" element={<PaymentPage />} />
    <Route path="/:userId/profile" element={<ProfilePage />}>
  <Route path="introduction" element={<Edit />} />
  <Route path="purchased" element={<Purchased />} />
</Route>
    
  </>
)}


{!isLoggedIn && (
  <Route path="/courses/:courseId" element={<CourseDetailPage />} />
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
          <Route path="courses" element={<CoursesTable />} />
          <Route path="courses/upload" element={<Upload />} />
          <Route path="courses/update/:courseId" element={<Update />} />
          <Route path="communication" element={<Communications />} />
          <Route path="revenue" element={<Revenues />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      {!isAdminDashboard && !isProfilePage && <Footer />}
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
