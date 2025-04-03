import { Request,Response } from "express"
import User from '../models/User'
import { hashPassword } from "../helper/auth"
import { generateToken } from "../helper/token"
import { AuthEmail } from "../emails/AuthEmail"
export class AuthController{
    static createAccount = async (req:Request,res:Response)=>{
        const {email,password,name} = req.body

        try {
            const userExist = await User.findOne({where:{email}})
            if(userExist){
                const error = new Error('User already exist with these email')
                res.status(409).json({error:error.message})
                return
            }

            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = generateToken()
            await AuthEmail.sendConfirmationEmail(
                {name,email,token:user.token})
            await user.save()
            
            res.status(201).json("User created succesfully")
        } catch (error) {
           // console.log(error);
           res.status(500).json({error:'There is error'})
            
        }
    }
}