import UsersTable from "@/components/admin/users/UsersTable";
import UserTableHeader from "@/components/admin/users/UserTableHeader";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Fixr | Admin users",
  description:
    "",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-4">
        <ComponentCard>
          <UserTableHeader/>
          <UsersTable/>
        </ComponentCard>
      </div>
    </div>
  );
}
