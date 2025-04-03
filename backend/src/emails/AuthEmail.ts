import { transport } from "../config/configNodemailer"

type EmailType ={
    name:string,
    email:string,
    token:string
}
export class AuthEmail{
    static sendConfirmationEmail=async (user:EmailType) =>{
        const email = await transport.sendMail({
          from: "CrashTaker <admin@castracker.com>",
          to: user.email,
          subject: "Castracker - Confirm your account",
          html: `
            <p>Hi ${user.name}, have created your account in CashTracker</p>
            <p>Follow the next link to confirm account</p>
            <a href="#">Confirm account</a>
            <p>Write token: <b>${user.token}</b></p>
                `,
        });

        console.log('EMail send',email.messageId);
        
        

    }
}