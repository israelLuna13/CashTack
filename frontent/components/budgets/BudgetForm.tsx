import { Budget } from "@/src/schemas";
//the parametrs is optional
export default function BudgetForm({budget}:{budget?:Budget}) {
  return (
    <>
      <div className="space-y-3">
        <label htmlFor="name" className="text-sm uppercase font-bold">
          Budget Name
        </label>
        <input
          id="name"
          className="w-full p-3  border border-gray-100 bg-slate-100"
          type="text"
          placeholder="Budget name"
          name="name"
          defaultValue={budget?.name}
        />
      </div>
      <div className="space-y-3">
        <label htmlFor="amount" className="text-sm uppercase font-bold">
          Budget Amount
        </label>
        <input
          type="number"
          id="amount"
          className="w-full p-3  border border-gray-100 bg-slate-100"
          placeholder="Amount budget"
          name="amount"
          defaultValue={budget?.amount}
        />
      </div>
    </>
  );
}
