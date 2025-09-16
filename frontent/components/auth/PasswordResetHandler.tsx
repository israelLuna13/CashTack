"use server"

import { useState } from "react"
import ResetPasswordForm from "./ResetPasswordForm"
import ValidateTokenForm from "./ValidaTokenForm"

export default function PasswordResetHandler() {
      const [token,setToken]=useState('')

    const [isValidToken,setIsValidToken]=useState(false)
  return (
    <>
    {!isValidToken ?
           <ValidateTokenForm token={token} setToken={setToken} setIsValidToken={setIsValidToken}/>
           :
           <ResetPasswordForm token={token}/>}
      
    </>
  )
}
