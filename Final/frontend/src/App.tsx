import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import NotFound from "./components/NotFound";
import Details from "./components/Details";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/weathers/:countryCode" element={<Details />} />
          <Route path="/weathers" element={<SearchBar />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/weathers" />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
