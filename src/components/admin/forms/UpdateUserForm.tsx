/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetUserByIdQuery, useUpdateUserMutation } from "@/app/lib/redux/api/adminApi";
import DefaultLoader from "@/components/loaders/DefaultLoader";
import Button from "@/components/ui/button/Button";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  name: string | null;
  password: string;
  role: "REPORTER" | "DEVELOPER" | "ADMIN";
}

interface FormErrors {
  email?: string;
  password?: string;
  role?: string;
}

interface UpdateUserFormProps {
  userId: string;
  onClose: () => void;
}

export default function UpdateUserForm({ userId, onClose }: UpdateUserFormProps) {
  const { data, isLoading: isFetching, error } = useGetUserByIdQuery(userId);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    role: "REPORTER",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Pre-fill form with user data
  useEffect(() => {
    if (data?.user) {
      setFormData({
        email: data.user.email,
        name: data.user.name || "",
        password: "",
        role: data.user.role as "REPORTER" | "DEVELOPER" | "ADMIN",
      });
    }
  }, [data]);

  // Handle fetch error
  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch user data");
    }
  }, [error]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((err) => toast.error(err));
      return;
    }

    try {
      const updateData: any = { email: formData.email, name: formData.name || null, role: formData.role };
      if (formData.password) updateData.password = formData.password;
      await updateUser({ id: userId, data: updateData }).unwrap();
      setErrors({});
      onClose();
      toast.success("User updated successfully");
    } catch (error: any) {
      toast.error(error.data?.error || "Failed to update user");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "name" && !value ? null : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  if (isFetching) return <div className="p-6 text-gray-900 dark:text-white flex justify-center items-center"><DefaultLoader/></div>;
  if (error) return <div className="p-6 text-red-500">Error loading user data</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-4">
        Update User
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password (Optional)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              type="button"
              className="absolute right-2 bottom-0 h-full transform -translate-y-1/2 top-[50%] flex items-center justify-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="REPORTER">Reporter</option>
            <option value="DEVELOPER">Developer</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-500">{errors.role}</p>
          )}
        </div>
        <div>
          <div className="flex justify-end gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              disabled={isUpdating || isFetching}
            >
              {isUpdating ? "Updating..." : "Update User"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}