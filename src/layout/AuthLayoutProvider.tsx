"use client"

// import { RootState } from "@/app/lib/redux/store";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import FullLoadingScreen from "@/components/loaders/FullLoadingScreen";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
//   const router = useRouter();
//   const { isAuthenticated, loading } = useSelector((state: RootState) => ({
//     isAuthenticated: state.auth.isAuthenticated,
//     loading: state.auth.isLoading,
//   }));

//   useEffect(() => {
//     if (isAuthenticated && !loading) {
//       router.push("/");
//     }
//   }, [isAuthenticated, router, loading]);

// //   if (loading) {
// //     return <FullLoadingScreen />;
// //   }

//   if (isAuthenticated) {
//     return null;
//   }

  return <>{children}</>;
}