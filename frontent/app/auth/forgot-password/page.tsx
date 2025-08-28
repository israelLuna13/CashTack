import ForgotPasswordForm from "@/components/auth/ForgotPassword";
import type { Metadata } from "next";
export const metada:Metadata={
    title:"Castraker - Forgot password",
    description:"Castraker - Forgot password"
}
export default function ForgotPasswordPage() {
    
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">
        {" "}
        Do you forgot your password?
      </h1>
      <p className="text-3xl font-bold text-purple-950">
        Here you can <span className="text-amber-500">Change</span>
      </p>
      <ForgotPasswordForm/>

    
    </>
  );
}
