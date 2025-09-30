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

export const TokenSchema = z.string({message:'Invalid token'})
                                    .min(6,{message:'Invalid token'})
                                    .max(6,{message:'Invalid token'})
export const LoginSchema = z.object({
    email:z.email({message:'Invalid email'}),
    password:z.string().min(1,{message:'The password is required'})
})

export const UserSchema = z.object({
    id:z.number(),
    name:z.string(),
    email:z.string()
})

export const ForgotPasswordSchema=z.object({
    email:z.email({message:'Invalid email'})
})

export const ResetPasswordSchema = z.object({
        password: z.string()
                .min(8, {message: 'El Password debe ser de al menos 8 caracteres'}),
        password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
        message: "Los Passwords no son iguales",
        path: ["password_confirmation"]
});

export const DraftBudgetSchema=z.object({
    name:z.string().min(1,{message:'The budget name is required'}),
    amount:z.coerce.number({message:'Invalid amount'}).min(1,{message:'Invalid amount'})
})
export const ExpenseAPIResponseSchema = z.object({
    id:z.number(),
    name:z.string(),
    amount:z.string(),
    createdAt:z.string(),
    updatedAt:z.string(),
    budgetId:z.number()
})
export const BudgetAPIResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        amount: z.string(),
        userId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
        expenses:z.array(ExpenseAPIResponseSchema)
})
export const PasswordValidationSchema=z.string().min(1,{message:'Invalid password'})

export const DraftExpenseSchema =z.object({
    name:z.string().min(1,{message:'Invalid name'}),
    amount:z.coerce.number({message:'Invalid amount'}).min(1,{message:'Invalid amount'})
})
export const SuccessSchema=z.string()

export const ErrorSchema=z.object({
    error:z.string()
})

export const BudgetAPIResponseSchemaArray=z.array(BudgetAPIResponseSchema.omit({expenses:true}))
//types
export type User= z.infer<typeof UserSchema>
export type Budget = z.infer<typeof BudgetAPIResponseSchema>
export type Expense = z.infer<typeof ExpenseAPIResponseSchema>