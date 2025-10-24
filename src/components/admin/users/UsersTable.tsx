/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDeleteUserMutation, useGetUsersQuery } from "@/app/lib/redux/api/adminApi";
import DeleteIcon from "@/components/icons/Delete";
import EditIcon from "@/components/icons/EditIcon";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import UpdateUserForm from "../forms/UpdateUserForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import ReusableAlert from "@/components/shared/alerts/ReusableAlerts";
import VeryShortLoader from "@/components/loaders/VeryShortLoader";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  projects: string[];
  bugsReported: number;
}

export default function UsersTable() {
  const { data, error, isLoading } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser]=useState<User|null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
   const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

 const handleDelete = (user:User) => {
    setDeleteUserId(user.id);
    setSelectedUser(user)
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteUserId) {
      try {
        await deleteUser(deleteUserId).unwrap();
      } catch (err: any) {
        toast.error(err.message||"Error deleting user")
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading users</div>;
  }

  const users: User[] = data?.users.filter((user)=>user.id!==currentUser?.id.toString()) || [];

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
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Role
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Projects
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Bugs Reported
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-4 py-4 sm:px-4 text-start">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.name || user.email}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge
                        size="sm"
                        color={
                          user.role === "ADMIN"
                            ? "success"
                            : user.role === "DEVELOPER"
                            ? "info"
                            : undefined
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.projects.length > 0 ? user.projects.join(", ") : "None"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.bugsReported}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                          onClick={() => handleEdit(user.id)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-2.5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                         onClick={() => handleDelete(user)}
                          disabled={user.id === String(currentUser?.id) || isDeleting}
                        >
                          {isDeleting?<VeryShortLoader/>:<DeleteIcon/>}
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
        className=" max-w-xl"
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUserId(null);
        }}
      >
        {selectedUserId && (
          <UpdateUserForm
            userId={selectedUserId}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUserId(null);
            }}
          />
        )}
      </Modal>
      <ReusableAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => {
          setIsDeleteAlertOpen(false);
          setDeleteUserId(null);
        }}
        title="Confirm Delete"
        content={`Are you sure you want to delete user "${selectedUser?.name || ""}"? This action cannot be undone.`}
        functionTitle="Delete"
        func={handleConfirmDelete}
        buttonStyle="bg-red-600"
      />
    </>
  );
}