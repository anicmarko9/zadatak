import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import NotFound from "./components/NotFound";
import React from "react";

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/weathers" element={<SearchBar />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/weathers" />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
