import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "./components/SearchBar";
import NotFound from "./components/NotFound";
import Details from "./components/Details";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UserSettings from "./components/User";
import AdminPanel from "./components/AdminPanel";

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <NavBar />
        <Routes>
          <Route path="/weathers/:countryCode" element={<Details />} />
          <Route path="/weathers" element={<SearchBar />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/login/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/me" element={<UserSettings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/weathers" />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
