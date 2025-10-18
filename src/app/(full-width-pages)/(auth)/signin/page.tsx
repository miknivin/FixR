import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bugify",
  description: "Bugify",
};

export default function SignIn() {
  return <SignInForm />;
}
