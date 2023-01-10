import React, { Fragment, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { promoteUser, suspendUser } from "../services/userSettings";
import { User } from "../types/userTypes";

const queryClient: QueryClient = new QueryClient();

export default function AdminPanel(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

const Example = (): JSX.Element => {
  const [userCount, setUserCount] = useState<number>(0);
  const {
    isLoading,
    error,
    data,
  }: { isLoading: boolean; error: AxiosError; data: User[] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async (): Promise<User[]> => {
      const response: AxiosResponse = await axios.get(
        `http://localhost:5000/users/`,
        { withCredentials: true }
      );
      setUserCount(response.data.results);
      return response.data.data.users;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const promoteUniqueUser = async (
    id: number,
    userRole: string
  ): Promise<void> => {
    let role: string;
    userRole === "admin" ? (role = "user") : (role = "admin");
    await promoteUser(id, role);
  };
  const deleteUniqueUser = async (id: number): Promise<void> => {
    await suspendUser(id);
  };

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
        <>
          <h1 className="users-count">There are {userCount} users.</h1>
          {data.map(
            (user: User, index: number): JSX.Element => (
              <Fragment key={index}>
                <div className="data-container">
                  <div className="user-info">
                    <div className="photo-name-email">
                      <img
                        className="item profile"
                        src={user.photo}
                        alt="Profile"
                      />
                      {user.role === "admin" ? (
                        <h2 style={{ color: "red" }}>{user.name}</h2>
                      ) : (
                        <h2 style={{ color: "white" }}>{user.name}</h2>
                      )}
                      <h3>{user.email}</h3>
                    </div>
                    <div className="bio-text">
                      <p>
                        <b>Biography: </b>
                        {user.bio}
                      </p>
                    </div>
                  </div>
                  <div className="action-buttons">
                    {user.role === "admin" ? (
                      <button
                        onClick={() => promoteUniqueUser(user.id, user.role)}
                        className="delete-user btn"
                      >
                        Demote
                      </button>
                    ) : (
                      <button
                        onClick={() => promoteUniqueUser(user.id, user.role)}
                        className="give-admin btn"
                      >
                        Promote
                      </button>
                    )}
                    <button
                      onClick={() => deleteUniqueUser(user.id)}
                      className="delete-user btn"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              </Fragment>
            )
          )}
        </>
      )}
    </div>
  );
};
