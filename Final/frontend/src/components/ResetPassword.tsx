import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { handleInput } from "../features/helper";
import { resetPassword } from "../services/auth";
import { InputData } from "../types/userTypes";

const ResetPassword = (): JSX.Element => {
  const { token } = useParams<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    setLoading(true);
    try {
      e.preventDefault();
      const input: InputData = handleInput("ResetPassword");
      await resetPassword(input.password, input.passwordConfirm, token);
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <form onSubmit={handleSubmit}>
        <h2>Reset password</h2>
        <p>Please enter your new password and confirm it.</p>
        <input
          type="password"
          id="password"
          placeholder="New password"
          autoFocus={true}
          required
        />
        <input
          type="password"
          id="passwordConfirm"
          placeholder="Confirm password"
          autoFocus={true}
          required
        />
        <div>
          <button type="submit">Reset password</button>
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

export default ResetPassword;
