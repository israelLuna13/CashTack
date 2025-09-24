"use server"

import getToken from "@/src/auth/token"
import { DraftBudgetSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType={
errors:string[],
success:string
}
export async function createBudget(prevStatae:ActionStateType,formData:FormData){
    const budget= DraftBudgetSchema.safeParse({
        name:formData.get('name'),
        amount:formData.get('amount')
    })

    if(!budget.success){
        return{
            errors:budget.error.issues.map(issue=>issue.message),
            success:''
        }
    }

    const token = getToken()

      const url = `${process.env.API_URL}/budgets`

      const req = await fetch(url,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({
            name:budget.data.name,
            amount:budget.data.amount
        })
      })
      
      const json = await req.json()

      //refresh all page , it invalid cache and bring update data
      revalidatePath('/admin')

      const success = SuccessSchema.parse(json)
    return{
        errors:[],
        success
    }
    
}