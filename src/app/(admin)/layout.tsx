"use client";
import AdminLayoutProvider from "@/layout/AdminLayoutProvider";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // // Dynamic class for main content margin based on sidebar state
  // const mainContentMargin = isMobileOpen
  //   ? "ml-0"
  //   : isExpanded || isHovered
  //   ? "lg:ml-[290px]"
  //   : "lg:ml-[90px]";



  return (
    <>
      <AdminLayoutProvider>{children}</AdminLayoutProvider>
    </>
  );
}
