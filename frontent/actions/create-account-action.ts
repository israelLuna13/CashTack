"use server"

import { ErrorSchema, RegisterSchema, SuccessSchema } from "@/src/schemas"

type ActionsStateType={
  
    errors: string[],
    success:string
}

export async function register(prevSatate:ActionsStateType,formData:FormData){
  //the data is comming from form action
   const registerForm={
    email:formData.get('email'),
     name:formData.get('name'),
     password:formData.get('password'),
     password_confirmation:formData.get('password_confirmation')
   }
  //check data and if there are issues return them to the view
  const result = RegisterSchema.safeParse(registerForm)
  if(!result.success){
      const errors =result.error.issues.map(issue => issue.message)
    return {
        errors,
        success:prevSatate.success
    }
  }
  
  const url = `${process.env.API_URL}/auth/create-account`

  const req = await fetch(url,{
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
    const json = await req.json()

    //we use the parse function because we know the data is coming in are string it is does not matter if it is succes o failed
    //if there are a issue with the request
  if(req.status === 409){
    const error = ErrorSchema.parse(json)
    return{
        errors:[error.error],
        success:''
    }
  }
  //return to the view with succefull message and without error
  const success = SuccessSchema.parse(json)
  return {
    errors:[],
    success:success
  }
}