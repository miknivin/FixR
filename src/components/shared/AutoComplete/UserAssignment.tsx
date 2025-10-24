/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useGetUsersQuery } from "@/app/lib/redux/api/adminApi";
import Chip from "@/components/ui/button/Chip";

interface IUser {
  id: string;
  name: string | null;
  email: string;
}

interface UserProjectAssignmentProps {
  projectId: string;
  assignedUsers: IUser[];
  onAssignedUsersChange: (newAssignedUsers: IUser[]) => void;
  disabled?: boolean;
}

export default function UserProjectAssignment({
//   projectId,
  assignedUsers,
  onAssignedUsersChange,
  disabled,
}: UserProjectAssignmentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: usersData, isLoading } = useGetUsersQuery();
  const users: IUser[] = React.useMemo(() => usersData?.users ?? [], [usersData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(e.target.value.length > 0);
  };

  const handleSelectMember = (member: IUser) => {
    if (member.id && !assignedUsers.some((user) => user.id === member.id)) {
      const newAssignedUsers = [...assignedUsers, member];
      onAssignedUsersChange(newAssignedUsers);
      setSearchQuery("");
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveUser = (userId: string | undefined) => {
    if (userId) {
      const newAssignedUsers = assignedUsers.filter((user) => user.id !== userId);
      onAssignedUsersChange(newAssignedUsers);
    }
  };

  return (
    <div className="mb-4 relative">
      <label htmlFor="user-search" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Assign Users
      </label>
      <input
        type="text"
        id="user-search"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search users"
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setIsDropdownOpen(searchQuery.length > 0)}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        disabled={disabled}
      />
      
      {assignedUsers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {assignedUsers.map((user) => (
            <Chip
              key={user.id}
              text={user.name || user.email}
              onRemove={() => handleRemoveUser(user.id)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
      
      {isDropdownOpen && (
        <UserDropdown 
          isLoading={isLoading}
          users={users}
          assignedUsers={assignedUsers}
          onSelectMember={handleSelectMember}
          disabled={disabled}
        />
      )}
    </div>
  );
}

const UserDropdown = ({
  isLoading,
  users,
  assignedUsers,
  onSelectMember,
  disabled,
}: {
  isLoading: boolean;
  users: IUser[];
  assignedUsers: IUser[];
  onSelectMember: (member: IUser) => void;
  disabled?: boolean;
}) => (
  <div className="z-50 absolute mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full dark:bg-gray-700 dark:divide-gray-600">
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
      {isLoading ? (
        <li className="block px-4 py-2">Loading...</li>
      ) : users.length > 0 ? (
        users
          .filter((user) => !assignedUsers.some((assigned) => assigned.id === user.id))
          .map((user) => (
            <li key={user.id}>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => onSelectMember(user)}
                disabled={disabled}
              >
                {user.name || user.email}
              </button>
            </li>
          ))
      ) : (
        <li className="block px-4 py-2">No users found</li>
      )}
    </ul>
  </div>
);