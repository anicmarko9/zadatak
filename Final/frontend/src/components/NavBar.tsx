import React, { useEffect, useState } from "react";
import { logout } from "../services/auth";
import { User } from "../types/userTypes";
const user: User = JSON.parse(window.localStorage.getItem("user"));
console.log(window.document.cookie);
const NavBar = (): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const logoutUser = async (): Promise<void> => {
    await logout();
  };
  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);
  return (
    <div className="topnav">
      <div>
        <a className="brand" href="/weathers">
          <img src="/logo.jpg" className="logo" alt="Logo" />
        </a>
      </div>
      <div>
        {loggedIn ? (
          <>
            <a className="not-brand" href="/me">
              <img
                src={JSON.parse(window.localStorage.getItem("user")).photo}
                alt="Avatar"
                className="avatar"
              />
            </a>
            <a className="not-brand" href="#logged-out" onClick={logoutUser}>
              Logout
            </a>
          </>
        ) : (
          <>
            <a className="not-brand" href="/login">
              Login
            </a>
            <a id="green" className="not-brand" href="/signup">
              Signup
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
