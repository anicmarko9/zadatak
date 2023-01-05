import React, { useState } from "react";
import { handleInput } from "../features/helper";
import { sendEmailResetToken } from "../services/auth";
import { InputData } from "../types/userTypes";

const ForgotPassword = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    setLoading(true);
    try {
      e.preventDefault();
      const input: InputData = handleInput("ForgotPassword");
      await sendEmailResetToken(input.email);
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <form onSubmit={handleSubmit}>
        <h2>Forgot password?</h2>
        <p>Please enter your email to search for your account.</p>
        <input
          type="text"
          id="email"
          placeholder="example@mail.com"
          autoFocus={true}
        />
        <div>
          <button type="submit">Send link to email</button>
          <a href="/login">Back to login</a>
        </div>
      </form>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <p className="loading"></p>
      )}
    </div>
  );
};

export default ForgotPassword;
