import {z} from 'zod'

export const RegisterSchema=z.object({
    email:z.string().min(1,{message:'The email is required'}).email({message:'Invalid email'}),
    name:z.string().min(1,{message:'The name is required'}),
    password:z.string().min(8,{message:'The password most be minium 8 characters'}),
    password_confirmation:z.string()
}).refine((data)=> data.password === data.password_confirmation,{
        message:'The password does not are same',
        path:['password_confirmation']
    } )

export const SuccessSchema=z.string()

export const ErrorSchema=z.object({
    error:z.string()
})

export const TokenSchema = z.string({message:'Invalid token'})
                                    .min(6,{message:'Invalid token'})
                                    .max(6,{message:'Invalid token'})