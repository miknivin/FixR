/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Project, useDeleteProjectMutation, useGetProjectsQuery } from "@/app/lib/redux/api/projectApi";
import DeleteIcon from "@/components/icons/Delete";
import EditIcon from "@/components/icons/EditIcon";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import ReusableAlert from "@/components/shared/alerts/ReusableAlerts";
import VeryShortLoader from "@/components/loaders/VeryShortLoader";
import { toast } from "react-toastify";
import { useState } from "react";
import UpdateProjectForm from "./forms/UpdateProjectForm";
import DefaultLoader from "../loaders/DefaultLoader";


export default function ProjectsTable() {
  const { data, error, isLoading } = useGetProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const handleEdit = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeleteProjectId(project.id);
    setSelectedProject(project.name);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteProjectId) {
      try {
        await deleteProject(deleteProjectId).unwrap();
      } catch (err: any) {
        toast.error(err.message || "Error deleting project");
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-gray-500 dark:text-gray-400 flex justify-center"><DefaultLoader/></div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading projects</div>;
  }

  const projects: Project[] = data?.projects || [];

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">

            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Users
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Bugs
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Created At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="px-4 py-4 sm:px-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {project.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm max-w-[200px] dark:text-gray-400">
                      <div className=" line-clamp-3">{project.description || "None"}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-wrap gap-2">
                        {project.users.length > 0 ? (
                          project.users.slice(-4).map((user,index) => (
                            <button
                              key={user.id ||index}
                              type="button"
                              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                              {user.name}
                            </button>
                          ))
                        ) : (
                          <span>None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {project.bugs.length}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                          onClick={() => handleEdit(project.id)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-2.5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                          onClick={() => handleDelete(project)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <VeryShortLoader /> : <DeleteIcon />}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isEditModalOpen}
        className="max-w-xl"
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProjectId(null);
        }}
      >
        {selectedProjectId && (
          <UpdateProjectForm
            projectId={selectedProjectId}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProjectId(null);
            }}
          />
        )}
      </Modal>
      <ReusableAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => {
          setIsDeleteAlertOpen(false);
          setDeleteProjectId(null);
        }}
        title="Confirm Delete"
        content={`Are you sure you want to delete the project "${selectedProject}"? This action cannot be undone.`}
        functionTitle="Delete"
        func={handleConfirmDelete}
        buttonStyle="bg-red-600"
      />
    </>
  );
}