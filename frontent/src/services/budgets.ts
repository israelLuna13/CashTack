import { cache } from "react";
import getToken from "@/src/auth/token";
import { BudgetAPIResponseSchema, BudgetAPIResponseSchemaArray } from "@/src/schemas";
import { notFound } from "next/navigation";
export const getBudget = cache(
   async (budgetId: string) => {
  const token = getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}`;
  const req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await req.json();
  console.log(json);
  
  if (!req.ok) {
    notFound();
  }
  const budget = BudgetAPIResponseSchema.parse(json);
  return budget;
   }
)

// to get budget we don't use server action, we only use the server action  when we want to make a request post , delete or update
export async function getUserBudgets() {
  const token = getToken();
  const url = `${process.env.API_URL}/budgets`;

  const req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    //we set tag name for refresh these query
    //all data budgets has name tag "all-budgets", we can refresh all these data
    next:{
      tags:['all-budgets']
    }
  });
  const json = await req.json();

  const budgtes = BudgetAPIResponseSchemaArray.parse(json);
  return budgtes;
}
