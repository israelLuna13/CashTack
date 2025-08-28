import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
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
    </>
  );
}
