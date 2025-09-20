import EditBudgetForm from "@/components/budgets/EditBudgetForm";
import { getBudget } from "@/src/services/budgets";
import { Metadata } from "next";
import Link from "next/link";

//this function dynamically change the page title
export async function generateMetadata({params}: {params: { id: string }}):Promise<Metadata>{
  const budgets = await getBudget(params.id)  
  return{
    title:`CashTrakerd: ${budgets.name}`,
    description:`CashTrakerd: ${budgets.name}`
  }
}

export default async function EditBudgetPage({params}: {params: { id: string }}) {

  const budget =await getBudget(params.id);

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center">
        <div className="w-full md:w-auto">
          <h1 className="font-black text-4xl text-purple-950 my-5">
            Update budget: {budget.name}
          </h1>
          <p className="text-xl font-bold">
            Create new {""}
            <span className="text-amber-500">budget</span>
          </p>
        </div>
        <Link
          href={"/admin"}
          className="bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center"
        >
          Volver
        </Link>
      </div>
      <div className="p-10 mt-10  shadow-lg border ">
        <EditBudgetForm budget={budget} />
      </div>
    </>
  );
}
