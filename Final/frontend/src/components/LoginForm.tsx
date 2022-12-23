import React from "react";

const LoginForm = (): JSX.Element => {
  const handleSubmit = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
    alert("Working!");
  };

  const createNewAcc = (): void => {
    window.location.href = "/signup";
  };

  return (
    <div className="colm-form">
      <form className="form-container" onSubmit={handleSubmit}>
        <input type="text" placeholder="Email address" />
        <input type="password" placeholder="Password" />
        <button type="submit" className="btn-login">
          Login
        </button>
        <a href="/">Forgotten password?</a>
        <button type="button" onClick={createNewAcc} className="btn-new">
          Create new Account
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
