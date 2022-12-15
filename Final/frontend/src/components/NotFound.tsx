import React from "react";
import { Link } from "react-router-dom";

const NotFound = (): JSX.Element => {
  return (
    <div className="not-found-container">
      <h2>Page Not Found</h2>
      <Link to="/">
        <h3>Home</h3>
      </Link>
    </div>
  );
};

export default NotFound;
