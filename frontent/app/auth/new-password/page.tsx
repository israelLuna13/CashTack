import PasswordResetHandler from "@/components/auth/PasswordResetHandler";

export default function NewPasswordPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">
       Reset Password
      </h1>
      <p className="text-3xl font-bold">
        Enter the code  you received
        <span className="text-amber-500"> by email</span>
      </p>

      <PasswordResetHandler />
    </>
  );
}
