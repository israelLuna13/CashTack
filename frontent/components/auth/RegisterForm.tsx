"use client"
import { register } from "@/actions/create-account-action"
import { useFormState } from "react-dom"
import ErrorMessage from "../ui/ErrorMessage"
import SuccesMessage from "../ui/SuccesMessage"
import { useEffect, useRef } from "react"

export default function RegisterForm() {

  //create a reference to the form element , initially set null
  const ref = useRef<HTMLFormElement>(null)
  //useFormState/useActionSatate: we going to work with that when we want to retive some kind of type of information from action such as error messages or succes messages

  const [state,dispatch]=useFormState(register,{
    errors:[],
    success:''
  })

  //we use that for clear the form when there is success message
  useEffect(()=>{
    //if there is success message it's means that user register was correct
    if(state.success){
      //clear form
      ref.current?.reset()
    }
  },[state])

  return (
//dispach going to execute the register action
    <form ref={ref} action={dispatch} className="mt-14 space-y-5" noValidate>

      {state.errors?.map( error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
      {state.success && <SuccesMessage>{state.success }</SuccesMessage>}
      
        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Nombre</label>
          <input
            type="name"
            placeholder="Nombre de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Password</label>
          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Repetir Password</label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password_confirmation"
          />
        </div>

        <input
          type="submit"
          value="Register"
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
        />
      </form>
  )
}
