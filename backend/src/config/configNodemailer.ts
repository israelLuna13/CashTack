import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

interface IConfig {
  host:string,
  port:number,
  auth:{
    user:string,
    pass:string
  }
}
dotenv.config()
const config = ():IConfig=>{
    return {
        host:process.env.EMAIL_HOST ,
        port: +process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    }
}
export const transport = nodemailer.createTransport(config())