import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DraftExpense } from "@/src/schemas";
import { useFormState } from "react-dom";
import editExpense from "@/actions/edit-expense-action";
import { toast } from "react-toastify";

export default function EditExpenseForm({ closeModal }: { closeModal: () => void }) {

  const [expense, setExpense] = useState<DraftExpense>();
  const { id: budgetId } = useParams();// rename id
  const searchParams = useSearchParams();
  const expenseId = searchParams.get("editExpenseId")!;//we use character ! to make sure that params will be in the url

  //we send params like object
  const editExpenseWithBudgetid = editExpense.bind(null, {
    budgetId: +budgetId,
    expenseId: +expenseId,
  });
  const [state, dispatch] = useFormState(editExpenseWithBudgetid, {
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
      closeModal();
    }
  }, [state]);

  //we to execute the route handler to execute the function to get the expenses, we can't to execute the function here cause this id client component
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_URL}/admin/api/budgets/${budgetId}/expenses/${expenseId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setExpense(data));
  }, []);
  return (
    <>
      <DialogTitle as="h3" className="font-black text-4xl text-purple-950 my-5">
        Edit expense
      </DialogTitle>
      <p className="text-xl font-bold">
        Edita los detalles de un {""}
        <span className="text-amber-500">gasto</span>
      </p>
      <form
        action={dispatch}
        className="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
        noValidate
      >
        <ExpenseForm expense={expense} />

        <input
          type="submit"
          className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
          value="Guardar Cambios"
        />
      </form>
    </>
  );
}