import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { User } from "../types/userTypes";
import catchError from "./catchError";

export const login = async (email: string, password: string): Promise<void> => {
  const data: User = await fetchLoginToken(email, password);
  if (data)
    window.setTimeout(() => {
      window.location.assign("/weathers");
    }, 1000);
  window.localStorage.setItem("user", JSON.stringify(data));
};

const fetchLoginToken = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const response: AxiosResponse = await axios.post(
      "http://localhost:5000/users/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    toast.success("Login successful", {
      position: "bottom-left",
    });
    return response.data.data.user;
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const logout = async (): Promise<void> => {
  await fetchLogout();
  window.localStorage.removeItem("user");
  window.setTimeout(() => {
    window.location.reload();
  }, 1000);
};

const fetchLogout = async (): Promise<void> => {
  try {
    await axios.get("http://localhost:5000/users/logout", {
      withCredentials: true,
    });
    toast.info("Logged out", {
      position: "bottom-left",
    });
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string
): Promise<void> => {
  const data: User = await fetchSignupToken(
    name,
    email,
    password,
    passwordConfirm
  );
  if (data)
    window.setTimeout(() => {
      window.location.assign("/weathers");
    }, 1000);
  window.localStorage.setItem("user", JSON.stringify(data));
};

const fetchSignupToken = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string
): Promise<User> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/users/signup",
      { name, email, password, passwordConfirm },
      { withCredentials: true }
    );
    toast.success("Signup successful", {
      position: "bottom-left",
    });
    return response.data.data.user;
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const sendEmailResetToken = async (email: string): Promise<void> => {
  await fetchResetToken(email);
};

const fetchResetToken = async (email: string): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.post(
      "http://localhost:5000/users/forgotPassword",
      { email }
    );
    toast.success(response.data.message, {
      position: "bottom-left",
    });
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const resetPassword = async (
  password: string,
  passwordConfirm: string,
  token: string
): Promise<void> => {
  const data: User = await fetchResetPassword(password, passwordConfirm, token);
  if (data)
    window.setTimeout(() => {
      window.location.assign("/weathers");
    }, 1000);
  window.localStorage.setItem("user", JSON.stringify(data));
};

const fetchResetPassword = async (
  password: string,
  passwordConfirm: string,
  token: string
): Promise<User> => {
  try {
    const response: AxiosResponse = await axios.patch(
      `http://localhost:5000/users/resetPassword/${token}`,
      { password, passwordConfirm },
      { withCredentials: true }
    );
    toast.info("New password set!", {
      position: "bottom-left",
    });
    return response.data.data.user;
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const updatePassword = async (
  passwordCurrent: string,
  password: string,
  passwordConfirm: string
): Promise<void> => {
  const data: User = await fetchUpdatePassword(
    passwordCurrent,
    password,
    passwordConfirm
  );
  if (data)
    window.setTimeout(() => {
      window.location.reload();
    }, 1000);
};

const fetchUpdatePassword = async (
  passwordCurrent: string,
  password: string,
  passwordConfirm: string
): Promise<User> => {
  try {
    const response: AxiosResponse = await axios.patch(
      "http://localhost:5000/users/updateMyPassword",
      { passwordCurrent, password, passwordConfirm },
      { withCredentials: true }
    );
    toast.success("Password changed.", {
      position: "bottom-left",
    });
    return response.data.data.user;
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};
