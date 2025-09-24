"use server"

import getToken from "@/src/auth/token"
import { ErrorSchema, PasswordValidationSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType={
    errors:string[],
    success:string
}
export async function deleteBudget(id:number,prevState:ActionStateType,formData:FormData){
    const currentPassword = PasswordValidationSchema.safeParse(
      formData.get("password")
    );
    if (!currentPassword.success) {
      return {
        errors: currentPassword.error.issues.map((issue) => issue.message),
        success: "",
      };
    }
    // check password
    const token = getToken();
    const checkPasswordUrl = `${process.env.API_URL}/auth/check-password`;
    const checkPasswordReq = await fetch(checkPasswordUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword.data,
      }),
    });
    const checkPasswordJson = await checkPasswordReq.json();
    if (!checkPasswordReq.ok) {
      const { error } = ErrorSchema.parse(checkPasswordJson);
      return {
        errors: [error],
        success: "",
      };
    }

    //delete budget
    const budgetDeleteUrl = `${process.env.API_URL}/budgets/${id}`;
    const budgetDeleteReq = await fetch(budgetDeleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    const deleteBudgetJson = await budgetDeleteReq.json();
    console.log(deleteBudgetJson);

    if (!budgetDeleteReq.ok) {
      const { error } = ErrorSchema.parse(deleteBudgetJson);
      return {
        errors: [error],
        success: "",
      };
    }

    //refresh all page , it invalid cache and bring update data
    revalidatePath("/admin");
    const success = SuccessSchema.parse(deleteBudgetJson);
    return {
      errors: [],
      success,
    };
    
}