import React from "react";

const SignupForm = (): JSX.Element => {
  const handleSubmit = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
    alert("Working!");
  };

  return (
    <div className="colm-form">
      <form className="form-container" onSubmit={handleSubmit}>
        <input type="text" placeholder="Full name" />
        <input type="text" placeholder="Email address" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Password confirm" />
        <a href="/login">Already have an account?</a>
        <button className="btn-new">Create new Account</button>
      </form>
    </div>
  );
};

export default SignupForm;
