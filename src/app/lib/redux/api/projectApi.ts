/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

interface IUser {
  id: string;
  name: string | null;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  users: IUser[];
  bugs: string[];
}

interface ProjectsResponse {
  projects: Project[];
}

interface AddProjectRequest {
  name: string;
  description?: string;
}

interface UpdateProjectRequest {
  id: string;
  name: string;
  description?: string;
}

interface AddProjectResponse {
  project: Project;
}

interface UpdateProjectResponse {
  project: Project;
}

interface AddUserProjectRequest {
  projectId: string;
  userId: string;
}

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/projects',
  }),
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, void>({
      query: () => ({ url: '/', method: 'GET' }),
      providesTags: ['Projects'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          toast.error(error.error?.data?.error || 'Failed to fetch projects');
        }
      },
    }),
    getProject: builder.query<AddProjectResponse, string>({
      query: (id) => ({ url: `/${id}`, method: 'GET' }),
      providesTags: ['Projects'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          toast.error(error.error?.data?.error || 'Failed to fetch project');
        }
      },
    }),
    addProject: builder.mutation<AddProjectResponse, AddProjectRequest>({
      query: (data) => ({ url: '/', method: 'POST', body: data }),
      invalidatesTags: ['Projects'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Project created successfully');
        } catch (error: any) {
          toast.error(error.error?.data?.error || 'Failed to create project');
        }
      },
    }),
    updateProject: builder.mutation<UpdateProjectResponse, UpdateProjectRequest>({
      query: ({ id, ...data }) => ({ url: `/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Projects'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Project updated successfully');
        } catch (error: any) {
          toast.error(error.error?.data?.error || 'Failed to update project');
        }
      },
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Projects'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Project deleted successfully');
        } catch (error: any) {
          toast.error(error.error?.data?.error || 'Failed to delete project');
        }
      },
    }),
    addUserProject: builder.mutation<void, AddUserProjectRequest>({
      query: ({ projectId, userId }) => ({
        url: `/${projectId}/users`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['Projects'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('User assigned to project successfully');
        } catch (error: any) {
          toast.error(error.error?.data?.error || 'Failed to assign user to project');
        }
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddUserProjectMutation,
} = projectApi;