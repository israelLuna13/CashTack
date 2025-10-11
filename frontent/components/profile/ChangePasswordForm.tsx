"use client"

import { updatePassword } from "@/actions/update-password-action"
import { useEffect, useRef } from "react"
import { useFormState } from "react-dom"
import { toast } from "react-toastify"

export default function ChangePasswordForm() {

    const ref = useRef<HTMLFormElement>(null)//  it this works to reset the form
    const [state,dispatch]=useFormState(updatePassword,{
        errors:[],
        success:''
    })
    useEffect(()=>{
        if(state.errors){
            state.errors.forEach(error=>{
                toast.error(error)
            })
        }

        if(state.success){
            toast.success(state.success)
            ref.current?.reset()
        }

    },[state])
  return (
    <>
      <form
        ref={ref}
        action={dispatch}
        className=" mt-14 space-y-5"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl"
            htmlFor="current_password"
          >Current Password</label>
          <input
            id="current_password"
            type="password"
            placeholder="Current Password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="current_password"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl"
            htmlFor="password"
          >New Password</label>
          <input
            id="password"
            type="password"
            placeholder="Register password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label
            htmlFor="password_confirmation"
            className="font-bold text-2xl"
          >Repeat Password</label>

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
          value='Change password'
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  )
}