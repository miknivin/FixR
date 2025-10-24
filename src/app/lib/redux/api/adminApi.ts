/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setError } from "../slices/authSlice";
import { toast } from "react-toastify";

interface UsersResponse {
  users: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
    projects: string[];
    bugsReported: number;
  }[];
}

interface UserResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
    projects: string[];
    bugsReported: number;
  };
}

interface AddUserRequest {
  email: string;
  name: string;
  password: string;
  role: "REPORTER" | "DEVELOPER" | "ADMIN";
}

interface AddUserResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

interface UpdateUserRequest {
  email?: string;
  name?: string | null;
  password?: string;
  role?: "REPORTER" | "DEVELOPER" | "ADMIN";
}

interface DeleteUserResponse {
  message: string;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/users",
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          const errorMessage = error.error?.data?.error || "Failed to fetch users";
          dispatch(setError(errorMessage));
          toast.error(errorMessage);
        }
      },
      providesTags: ["Users"],
    }),
    addUser: builder.mutation<AddUserResponse, AddUserRequest>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User added successfully");
        } catch (error: any) {
          const errorMessage = error.error?.data?.error || "Failed to add user";
          dispatch(setError(errorMessage));
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ["Users"],
    }),
    getUserById: builder.query<UserResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          const errorMessage = error.error?.data?.error || "Failed to fetch user";
          dispatch(setError(errorMessage));
          toast.error(errorMessage);
        }
      },
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation<UserResponse, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User updated successfully");
        } catch (error: any) {
          const errorMessage = error.error?.data?.error || "Failed to update user";
          dispatch(setError(errorMessage));
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User deleted successfully");
        } catch (error: any) {
          const errorMessage = error.error?.data?.error || "Failed to delete user";
          dispatch(setError(errorMessage));
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApi;