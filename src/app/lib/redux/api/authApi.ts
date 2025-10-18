/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, setError, setLoading } from "@/app/lib/redux/slices/authSlice";

interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: UserResponse;
}

interface RegisterResponse {
  message: string;
  user: UserResponse;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth" }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (error: any) {
          dispatch(setError(error.error?.data?.error || "Login failed"));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (error: any) {
          dispatch(setError(error.error?.data?.error || "Registration failed"));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;