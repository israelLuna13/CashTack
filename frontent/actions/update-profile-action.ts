"use server"

import getToken from "@/src/auth/token"
import { ErrorSchema, SuccessSchema, UpdateProfileSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType={
    errors:string[],
    success:string
}
export async function updateProfile(prevState:ActionStateType,formData:FormData){
    const updateProfile = UpdateProfileSchema.safeParse({
        name:formData.get('name'),
        email:formData.get('email')
    })
    if(!updateProfile.success){
        return{
            errors:updateProfile.error.issues.map(issue=>issue.message),
            success:''
        }
    }
        const token = getToken()
        const url = `${process.env.API_URL}/auth/user`
    
        const req = await fetch(url,{
            method:'PUT',
            headers:{
                'Content-type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({
                name:updateProfile.data.name,
                email:updateProfile.data.email
            })
        })
            const json = await req.json()
            console.log(json);
            
            if(!req.ok){
                const{error}=ErrorSchema.parse(json)
                return{
                    errors:[error],
                    success:''
                }
            }
            const success= SuccessSchema.parse(json)
            revalidatePath('/admin/profile/settings')
    
    return{
        errors:[],
        success
    }
}