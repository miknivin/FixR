import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProjectsTable from "@/components/projects/ProjectTable";
import ProjectTableHeader from "@/components/projects/ProjectTableHeader";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Fixr | Projects",
  description:
    "",
  // other metadata
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Projects" />
      <div className="space-y-4">
        <ComponentCard>
          <ProjectTableHeader/>
          <ProjectsTable/>
        </ComponentCard>
      </div>
    </div>
  );
}
