import ProgressBar from '@/components/budgets/ProgressBar'
import AddExpensesButton from '@/components/expenses/AddExpensesButton'
import ExpenseMenu from '@/components/expenses/ExpensesMenu'
import Amount from '@/components/ui/Amount'
import ModalContainer from '@/components/ui/ModalContainer'
import { getBudget } from '@/src/services/budgets'
import { formatCurrency, formatDate } from '@/src/utils'
import { Metadata } from 'next'
import React from 'react'
//this function dynamically change the page title
export async function generateMetadata({params}: {params: { id: string }}):Promise<Metadata>{
  const budgets = await getBudget(params.id)  
  
  return{
    title:`CashTrakerd: ${budgets.name}`,
    description:`CashTrakerd: ${budgets.name}`
  }
}
export default async function BudgetDetailsPage({params}:{params:{id:string}}) {
    const budget =await  getBudget(params.id)
    const totalSpent = budget.expenses.reduce((total,expense)=> +expense.amount + total,0)
    const totalAvailable = +budget.amount - totalSpent
    const porcentage = +((totalSpent/ +budget.amount) *100).toFixed(2)
    
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-black text-4xl text-purple-950">{budget.name}</h1>
          <p className="text-xl font-bold">
            Manage yours {""} <span className="text-amber-500">expenses</span>
          </p>
        </div>
        <AddExpensesButton />
      </div>
      {budget.expenses.length ? (
        <>
        {/* progress bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 mt-10">
            <div>
              <ProgressBar porcentage={porcentage} />
            </div>
            <div className="flex flex-col justify-center items-center md:items-start gap-5">
              <Amount label="Presupuesto" amount={+budget.amount} />
              <Amount label="Enabled" amount={totalAvailable} />
              <Amount label="Gastado" amount={totalSpent} />
            </div>
          </div>
        {/* progress bar */}

          <h1 className="font-black text-4xl text-purple-950 mt-10">
            Expenses
          </h1>
          <ul
            role="list"
            className="divide-y divide-gray-300 border shadow-lg mt-10 "
          >
            {budget.expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between gap-x-6 p-5">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <p className="text-2xl font-semibold text-gray-900">
                      {" "}
                      {expense.name}
                    </p>
                    <p className="text-xl font-bold text-amber-500">
                      {formatCurrency(+expense.amount)}
                    </p>
                    <p className="text-gray-500  text-sm">
                      Added: {""}
                      <span className="font-bold">
                        {formatDate(expense.updatedAt)}
                      </span>
                    </p>
                  </div>
                </div>
                <ExpenseMenu expenseId={expense.id} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-center py-20">There are not expenses yet</p>
      )}
      <ModalContainer />
    </>
  );
}
