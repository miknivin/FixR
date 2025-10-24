import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fixr",
  description: "Fixr",
};

export default function SignIn() {
  return <SignInForm />;
}
