import React from "react";

const NavBar = (): JSX.Element => {
  return (
    <div className="topnav">
      <div>
        <a className="brand" href="/weathers">
          <div>
            <img src="/logo.png" alt="Logo" />
          </div>
        </a>
      </div>
      <div>
        {/* <a className="not-brand" href="/login">
          Me
        </a>
        <a className="not-brand" href="/login">
          Logout
        </a> */}
        <a className="not-brand" href="/login">
          Login
        </a>
        <a id="green" className="not-brand" href="/signup">
          Signup
        </a>
      </div>
    </div>
  );
};

export default NavBar;
