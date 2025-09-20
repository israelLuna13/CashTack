"use server"

import getToken from "@/src/auth/token";
import { Budget, DraftBudgetSchema, ErrorSchema, SuccessSchema } from "@/src/schemas";
import {  revalidateTag } from "next/cache";

type ActionStateType={
    errors:string[],
    success:string
}
export async function editBudget(budgetId:Budget['id'],prevState:ActionStateType,formData:FormData){
    const budgetData = {
      name: formData.get("name"),
      amount: formData.get("amount"),
    };
    const budget = DraftBudgetSchema.safeParse(budgetData);
    if (!budget.success) {
      return {
        errors: budget.error.issues.map((issue) => issue.message),
        success: "",
      };
    }

    const token = getToken();
    const url = `${process.env.API_URL}/budgets/${budgetId}`;
    const req = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: budget.data.name,
        amount: budget.data.amount,
      }),
    });
    const json = await req.json();
    if (!req.ok) {
      const { error } = ErrorSchema.parse(json);
      return {
        errors: [error],
        success: "",
      };
    }
    //revalidatePath('/admin') // update all url and all actions
    //we can execute the function or action again with this mame
    revalidateTag("/all-budgets"); //we refresh data budgets, this way we can have the last updates
    const success = SuccessSchema.parse(json);
    return {
      errors: [],
      success,
    };
    
}