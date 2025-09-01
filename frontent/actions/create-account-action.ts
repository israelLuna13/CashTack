"use server"

import { ErrorSchema, RegisterSchema, SuccessSchema } from "@/src/schemas"

type ActionsStateType={
  
    errors: string[],
    success:string
}

export async function register(prevSatate:ActionsStateType,formData:FormData){
   const registerForm={
    email:formData.get('email'),
     name:formData.get('name'),
     password:formData.get('password'),
     password_confirmation:formData.get('password_confirmation')
   }
  //check
  const result = RegisterSchema.safeParse(registerForm)
  if(!result.success){
      const errors =result.error.issues.map(issue => issue.message)
    return {
        errors,
        success:prevSatate.success
    }
  }
  
  const url = `${process.env.API_URL}/auth/create-account`

  const request = await fetch(url,{
    method:'POST',
    headers:{
        'Content-type':'application/json'
    },
    body:JSON.stringify({
        email:result.data.email,
        name:result.data.name,
        password:result.data.password
    })
  })
    const json = await request.json()

  if(request.status === 409){
    const error = ErrorSchema.parse(json)
    return{
        errors:[error.error],
        success:''
    }
  }
  const success = SuccessSchema.parse(json)
  return {
    errors:[],
    success:success
  }
}