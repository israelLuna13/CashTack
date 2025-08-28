import LoginForm from "@/components/login/LoginForm";
import type { Metadata } from "next";
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

    
    </>
  );
}
