"use client"
import { Budget } from "@/src/schemas";
import BudgetForm from "./BudgetForm";
import { useFormState } from "react-dom";
import { editBudget } from "@/actions/edit-budget-action";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EditBudgetForm({budget}:{budget:Budget}) {
    const router = useRouter();

    //we use function bind because the function useFormState does not allow passing extra params (only prevState and formData). with bind we fix budget.id so it will always be passed to the editBudget function

    //We use bind because useFormState does not allow passing additional parameters (only state and formData). With bind, we can pre-set a parameter so it is always passed to the target function.
    const editBudgetWithId = editBudget.bind(null, budget.id);

    const [state, dispatch] = useFormState(editBudgetWithId, {
      errors: [],
      success: "",
    });

    useEffect(() => {
      if (state.errors) {
        state.errors.forEach((error) => {
          toast.error(error);
        });
      }
      if (state.success) {
        toast.success(state.success);
        router.push("/admin");
      }
    }, [state]);
  return (
    <>
      <form action={dispatch} className="mt-10 space-y-3" noValidate>
        <BudgetForm budget={budget} />

        <input
          type="submit"
          className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
          value="Save"
        />
      </form>
    </>
  );
}
