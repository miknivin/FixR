/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAddProjectMutation, useAddUserProjectMutation } from "@/app/lib/redux/api/projectApi";
import UserProjectAssignment from "@/components/shared/AutoComplete/UserAssignment";
import Button from "@/components/ui/button/Button";

import React, { useState } from "react";

interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  general?: string;
}

interface IUser {
  id: string;
  name: string | null;
  email: string;
}

export default function AddProjectForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [assignedUsers, setAssignedUsers] = useState<IUser[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [addProject, { isLoading: isAddingProject }] = useAddProjectMutation();
  const [addUserProject, { isLoading: isAddingUser }] = useAddUserProjectMutation();

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Create project
      const { project } = await addProject({
        name: formData.name,
        description: formData.description || undefined,
      }).unwrap();

      // Assign users to the project
      for (const user of assignedUsers) {
        await addUserProject({ projectId: project.id, userId: user.id }).unwrap();
      }

      setErrors({});
      setFormData({ name: "", description: "" });
      setAssignedUsers([]);
      onClose();
    } catch (error: any) {
      setErrors({ general: error.data?.error || "Failed to add project or assign users" });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-4">
        Add New Project
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={isAddingProject || isAddingUser}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        <div>
          <UserProjectAssignment
            projectId=""
            assignedUsers={assignedUsers}
            onAssignedUsersChange={setAssignedUsers}
            disabled={isAddingProject || isAddingUser}
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            rows={4}
            disabled={isAddingProject || isAddingUser}
          />
        </div>

        <div>
          {errors.general && (
            <p className="mb-4 text-sm text-red-500">{errors.general}</p>
          )}
          <div className="flex justify-end gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isAddingProject || isAddingUser}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              disabled={isAddingProject || isAddingUser}
            >
              {isAddingProject || isAddingUser ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}