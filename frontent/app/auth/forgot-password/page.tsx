import ForgotPasswordForm from "@/components/auth/ForgotPassword";
import type { Metadata } from "next";
import Link from "next/link";
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

        <nav className="mt-10 flex flex-col space-y-4">
        <Link className="text-center text-gray-500" href={"/auth/login"}>
        You have a an account? Login
        </Link>

          <Link className="text-center text-gray-500" href={"/auth/register"}>
        You do not a an account? Create account
        </Link>
      </nav>
    </>
  );
}
