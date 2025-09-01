import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
export const metada:Metadata={
    title:"Castraker - Create account",
    description:"Castraker - Create account"
}
export default function RegisterPage() {
    
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">
        {" "}
        Create an account
      </h1>
      <p className="text-3xl font-bold text-purple-950">
        and manage your <span className="text-amber-500">Finanzas</span>
      </p>
      <RegisterForm/>
      
      <nav className="mt-10 flex flex-col space-y-4">
        <Link className="text-center text-gray-500" href={"/auth/login"}>
        You have a an account? Login
        </Link>

         <Link className="text-center text-gray-500" href={"/auth/forgot-password"}>
        You have forgot your password? Reset password
        </Link>
      </nav>
    </>
  );
}
