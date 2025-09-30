"use server"

import getToken from "@/src/auth/token"
import { DraftExpenseSchema, ErrorSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType={
    errors:string[],
    success:string
}
export async function createExpense(id:number,prevState:ActionStateType,formData:FormData){
    const expenseData={
        name:formData.get('name'),
        amount:formData.get('amount')
    }
    const expense = DraftExpenseSchema.safeParse(expenseData)
    if(!expense.success){
        return {
            errors:expense.error.issues.map(issue=>issue.message),
            success:''
        }
    }
    //create expense
    const token = getToken()
    const url = `${process.env.API_URL}/budgets/${id}/expenses`;

    const req = await fetch(url,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({
            name:expense.data.name,
            amount:expense.data.amount
        })
    })

    const json = await req.json()
    
    if(!req.ok){
        const {error}= ErrorSchema.parse(json)
        return{
            errors:[error],
            success:''
        }
    }

    const success= SuccessSchema.parse(json)
    revalidatePath(`/admin/budgets/${id}`)
    
    return{
        errors:[],
        success
    }
    
}