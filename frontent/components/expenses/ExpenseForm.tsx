import { DraftExpense } from "@/src/schemas"

type ExpenseFormProps={
    expense?:DraftExpense
}
export default function ExpenseForm({expense}:ExpenseFormProps) {
    return (
      <>
        <div className="mb-5">
          <label htmlFor="name" className="text-sm uppercase font-bold">
            Name Expense
          </label>
          <input
            id="name"
            className="w-full p-3  border border-gray-100  bg-white"
            type="text"
            placeholder="Name Expense"
            name="name"
            defaultValue={expense?.name}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="amount" className="text-sm uppercase font-bold">
            Amount Expense
          </label>
          <input
            id="amount"
            className="w-full p-3  border border-gray-100 bg-white"
            type="number"
            placeholder="Amount Expense"
            name="amount"
            defaultValue={expense?.amount}
          />
        </div>
      </>
    );
}