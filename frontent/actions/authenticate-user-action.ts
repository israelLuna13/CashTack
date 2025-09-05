"use server"
import {cookies} from 'next/headers'

import { ErrorSchema, LoginSchema } from "@/src/schemas"

type ActionStateType={
    errors:string[]
}

export async function authenticate(prevState:ActionStateType, formData:FormData){

    const loginCredentials={
        email:formData.get('email'),
        password:formData.get('password')
    }

    const auth = LoginSchema.safeParse(loginCredentials)
    if(!auth.success){
        return{
            errors:auth.error.issues.map(issue=>issue.message)
        }
    }
    const url= `${process.env.API_URL}/auth/login`
    const req = await fetch(url,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            email:auth.data.email,
            password:auth.data.password
        })
    })

    const json= await req.json()
    if(!req.ok){
        const{error}= ErrorSchema.parse(json)
        return{
            errors:[error]
        }
    }
    //set cookies
    cookies().set({
        name:'CASTRACKER_TOKEN',
        value:json,
        httpOnly:true,//client element don't have acces to cookie, only server components
        path:'/'
    })
        return{
        errors:[]
    }
    
    
}