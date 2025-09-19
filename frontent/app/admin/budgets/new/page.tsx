import CreateBudgetForm from "@/components/budgets/CreateBudgetForm";
import Link from "next/link";

export default function CreateBudgetPage() {
  return (
    <>
      <div className='flex flex-col-reverse md:flex-row md:justify-between items-center'>
        <div className='w-full md:w-auto'>
          <h1 className='font-black text-4xl text-purple-950 my-5'>
            New Budget
          </h1>
          <p className="text-xl font-bold">Create a new budget{''}
            <span className="text-amber-500">budget</span>
          </p>
        </div>
        <Link
          href={'/admin'}
          className='bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center'
        >
          Go back
        </Link>
      </div>

      <div className='p-10 mt-10  shadow-lg border '>
        <CreateBudgetForm/>
      </div>
    </>
  )
}