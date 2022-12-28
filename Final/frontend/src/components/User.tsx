import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { updatePassword } from "../services/auth";
import { deleteMe, updateUser } from "../services/userSettings";
import { InputData, User } from "../types/userTypes";
import { handleInput } from "../features/helper";

const queryClient: QueryClient = new QueryClient();

export default function UserSettings(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

const Example = (): JSX.Element => {
  const {
    isLoading,
    error,
    data,
  }: { isLoading: boolean; error: AxiosError; data: User } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async (): Promise<User> => {
      const response: AxiosResponse = await axios.get(
        `http://localhost:5000/users/me`,
        { withCredentials: true }
      );
      return response.data.data.user;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const [val, setVal] = useState<boolean>(true);
  const [clicked, setClicked] = useState<string>("account");

  const handleSubmit = async (option: string): Promise<void> => {
    const input: InputData = handleInput(option);
    if (option === "UpdateMyPass") {
      await updatePassword(
        input.passwordCurrent,
        input.password,
        input.passwordConfirm
      );
    } else {
      await updateUser(input.name, input.bio);
    }
  };

  const handleTab = (option: string): void => {
    handleInput(option);
    setClicked(option);
  };

  const deleteUser = async (): Promise<void> => {
    await deleteMe();
  };

  useEffect(() => {
    if (clicked === "account") {
      setVal(true);
    } else {
      setVal(false);
    }
  }, [clicked, val]);

  return (
    <div>
      {isLoading ? (
        <h1 className="country-container">Loading...</h1>
      ) : error ? (
        <>
          <h1 className="country-container">
            {error.response.data["message"]}
          </h1>
        </>
      ) : (
        <div className="user-container">
          <h1>Account Settings</h1>
          <div className="settings">
            <div className="side-nav">
              <div>
                <img className="item profile" src={data.photo} alt="Avatar" />
                {data.role === "admin" ? (
                  <h4
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => window.location.assign("/admin")}
                    className="item"
                  >
                    {data.name}
                  </h4>
                ) : (
                  <h4
                    style={{ color: "white", cursor: "default" }}
                    className="item"
                  >
                    {data.name}
                  </h4>
                )}
              </div>
              <div>
                <a
                  onClick={() => handleTab("account")}
                  className="item"
                  id="account"
                  href="#account"
                >
                  Account
                </a>
                <a
                  onClick={() => handleTab("password")}
                  className="item"
                  id="password"
                  href="#password"
                >
                  Password
                </a>
              </div>
            </div>
            {val ? (
              <div className="userSettings">
                <h3 style={{ color: "white" }}>Account Settings</h3>
                <div className="centerFlex">
                  <div>
                    <label className="item">Name</label>
                    <input
                      className="item inputForm"
                      id="name"
                      type="text"
                      defaultValue={data.name}
                    />
                  </div>
                  <div>
                    <label className="item">Email</label>
                    <input
                      className="item inputForm"
                      type="text"
                      defaultValue={data.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="item">Biography</label>
                    <textarea
                      name="bio"
                      className="item"
                      id="textArea"
                      rows={4}
                      cols={50}
                      placeholder="Tell us something about yourself..."
                      defaultValue={data.bio}
                    ></textarea>
                  </div>
                </div>
                <div className="buttons">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => handleSubmit("UpdateNameBio")}
                  >
                    Update
                  </button>
                  <button
                    id="delete"
                    type="button"
                    className="btn"
                    onClick={deleteUser}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="passwordSettings">
                <h3 style={{ color: "white" }}>Password Settings</h3>
                <div className="centerFlex">
                  <div>
                    <label className="item">Current password</label>
                    <input
                      id="current"
                      className="item inputForm"
                      type="password"
                    />
                  </div>
                  <div>
                    <label className="item">New password</label>
                    <input
                      id="new"
                      className="item inputForm"
                      type="password"
                    />
                  </div>
                  <div>
                    <label className="item">Confirm new password</label>
                    <input
                      id="newConfirm"
                      className="item inputForm"
                      type="password"
                    />
                  </div>
                </div>
                <div className="buttons">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => handleSubmit("UpdateMyPass")}
                  >
                    Update
                  </button>
                  <button
                    id="delete"
                    type="button"
                    className="btn"
                    onClick={deleteUser}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
