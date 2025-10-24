"use client";

// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
// import FullLoadingScreen from "@/components/loaders/FullLoadingScreen";
// import { RootState } from "@/app/lib/redux/store";
// import { useSidebar } from "@/context/SidebarContext";
// import AppSidebar from "@/layout/AppSidebar";

export default function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  // const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  // const router = useRouter();
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  // const loading = useSelector((state: RootState) => state.auth.isLoading);

  // // const mainContentMargin = isMobileOpen
  // //   ? "ml-0"
  // //   : isExpanded || isHovered
  // //   ? "lg:ml-[290px]"
  // //   : "lg:ml-[90px]";

  // useEffect(() => {
  //   if (isAuthenticated === false && !loading) {
  //     router.push("/signin");
  //   }
  // }, [isAuthenticated, loading, router]);

  // if (loading) {
  //   return <FullLoadingScreen />;
  // }

  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <div className="min-h-screen xl:flex">
      {/* <AppSidebar /> */}
      <Backdrop />
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <AppHeader />
        <div className="p-4 mx-auto max-w-[var(--breakpoint-2xl)] md:p-6">{children}</div>
      </div>
    </div>
  );
}