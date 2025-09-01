import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/login/LoginForm";

export const metada:Metadata={
    title:"Castraker - Login",
    description:"Castraker - Login"
}
export default function LoginPage() {
    
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">
        {" "}
        Login
      </h1>
      <p className="text-3xl font-bold text-purple-950">
        and manage your <span className="text-amber-500">Finanzas</span>
      </p>
      <LoginForm/>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link className="text-center text-gray-500" href={"/auth/register"}>
        You do not a an account? Create account
        </Link>
      </nav>

    
    </>
  );
}
