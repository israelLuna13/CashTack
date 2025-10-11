"use client"

import { updateProfile } from "@/actions/update-profile-action"
import { User } from "@/src/schemas"
import { useEffect, useRef } from "react"
import { useFormState } from "react-dom"
import { toast } from "react-toastify"

export default function ProfileForm({user}:{user:User}) {
  const ref = useRef<HTMLFormElement>(null)//  it this works to reset the form

  const [state,dispatch]=useFormState(updateProfile,{
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
          >Name</label>
          <input
            type="name"
            placeholder="Your name"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="name"
            defaultValue={user.name}
          />
        </div>
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Your email"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
            defaultValue={user.email}
          />
        </div>

        <input
          type="submit"
          value='Save'
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  )
}