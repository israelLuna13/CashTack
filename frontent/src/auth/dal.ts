import "server-only" //this file only will execute in the server
import {cache} from 'react'
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import { UserSchema } from "../schemas";

//we use cache to keep session and performace also if token does not changed
export const verifySession =cache(async()=>{
    const token = cookies().get('CASTRACKER_TOKEN')
    if(!token)
        redirect('/auth/login')    

    //we check if token is valid
    const url = `${process.env.API_URL}/auth/user`
    
    const req = await fetch(url,{
        headers:{
            Authorization:`Bearer ${token.value}`
        }
    })

    const session = await req.json()
    const result = UserSchema.safeParse(session)
    if(!result.success){
        redirect('/auth/login')
    }

    return {
        user:result.data,
        isAuth:true
    }
    
}
)