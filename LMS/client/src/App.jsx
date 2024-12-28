import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Footer from "./Footer/Footer";
import SignUpPage from "./Pages/SignUpPage";
import SignInPage from "./Pages/SignInPage";
import { useEffect, useState } from "react";
import Header from "./Header/Header";
import CoursesPage from "./Pages/CoursesPage";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);
  return (
    <>
    <Header />
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
      </Routes>
      <Footer />
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
