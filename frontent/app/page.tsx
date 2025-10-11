import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="bg-purple-950 py-5">
        <div className="max-w-3xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="w-96 lg:w-[500px]">
            <Logo />
          </div>
          <nav className="flex flex-col lg:flex-row lg:justify-end gap-5 w-full">
            <Link
              href="/auth/login"
              className="font-bold text-white hover:text-amber-500 uppercase text-sm text-center"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="font-bold text-white hover:text-amber-500 uppercase text-sm text-center"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-5 space-y-5 mt-20">
        <h1 className="font-black text-4xl lg:text-6xl text-purple-950">
          Manage Expenses
        </h1>
        <p className="text-3xl font-bold">
          Take control of your <span className="text-amber-500">finances</span>
        </p>
        <p className="text-lg">
          Master your finances with our Expense Manager. Simplify the management
          of your income and expenses all in one place — intuitive and efficient.
          Gain full control of your personal or business finances with our easy-to-use
          platform.
        </p>

        <h2 className="font-black text-4xl text-purple-950">
          Advantages of CashTrackr
        </h2>

        <ol className="grid grid-cols-1 gap-5 items-start">
          <li className="p-5 shadow-lg text-lg">
            <span className="text-purple-950 font-black">
              Effortless Organization:{" "}
            </span>
            Categorize and visualize your expenses clearly and neatly, without
            complications, using our friendly and easy-to-use dashboard.
          </li>
          <li className="p-5 shadow-lg text-lg">
            <span className="text-purple-950 font-black">
              Smart Budgeting:{" "}
            </span>
            Set realistic financial goals and track your progress with our smart
            budgeting tools.
          </li>
          <li className="p-5 shadow-lg text-lg">
            <span className="text-purple-950 font-black">
              Access Anywhere:{" "}
            </span>
            Manage your finances from wherever you are with our accessible and
            reliable platform.
          </li>
          <li className="p-5 shadow-lg text-lg">
            <span className="text-purple-950 font-black">
              Guaranteed Security:{" "}
            </span>
            Your data is protected with top security standards, allowing you to
            use our platform with complete peace of mind.
          </li>
        </ol>
      </main>

      <nav className="flex flex-col lg:flex-row lg:justify-between gap-5 mt-10 pb-20 max-w-3xl mx-auto">
        <Link
          href="/auth/register"
          className="text-gray-500 text-sm uppercase text-center"
        >
          Don’t have an account? Create one
        </Link>
        <Link
          href="/auth/login"
          className="text-gray-500 text-sm uppercase text-center"
        >
          Already have an account? Sign In
        </Link>
      </nav>
    </>
  );
}
