import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../helper/auth";
import { generateToken } from "../helper/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../helper/jtw";
export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        const error = new Error("User already exist with these email");
        res.status(409).json({ error: error.message });
        return;
      }

      const user = await User.create(req.body);
      user.password = await hashPassword(password);

      const token = user.token = generateToken();

      //saved token in the global object to doing integration test before token be deleted
      if(process.env.NODE_ENV !== 'production')
      {
        globalThis.cashTrackerConfirmationToken = token
      }
      user.token = token
      await user.save();

      await AuthEmail.sendConfirmationEmail({ name, email, token: user.token });
      res.status(201).json("User created succesfully");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    // const { token } = req.body;
    try {
    //   const existUserWithToken = await User.findOne({
    //     where: { token: token },
    //   });
    //   if (!existUserWithToken) {
    //     const error = new Error("The token does not exist");
    //     res.status(409).json({ error: error.message });
    //     return;
    //   }
   
    
     const {userToken} = req

     userToken.confirmed = true;
     userToken.token = null;
      await userToken.save();
      res.send("User successfully confirmedy");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is error" });
    }
  };
  static login = async (req: Request, res: Response) => {
    const {password } = req.body;
    const {userExist}=req
    
    try {
      // const userExist = await User.findOne({ where: { email: email } });
      // if (!userExist) {
      //   const error = new Error("User does not exist");
      //   res.status(404).json({ error: error.message });
      //   return;
      // }
    

      if (!userExist.confirmed) {
        const error = new Error("You have not confirm your account");
        res.status(403).json({ error: error.message });
        return;
      }

      const isPasswordCorrect = await checkPassword(
        password,
        userExist.password
      );
      if (!isPasswordCorrect) {
        const error = new Error("Incorrect password");
        res.status(401).json({ error: error.message });
        return;
      }

      const jwt = generateJWT(userExist.id);
      res.json(jwt);
    } catch (error) {
      //console.log(error);
      res.status(500).json({ error: "There is error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const { userExist } = req;
    try {
      // const userExist = await User.findOne({ where: { email: email } });
      // if (!userExist) {
      //   const error = new Error("User does not exist");
      //   res.status(404).json({ error: error.message });
      //   return;
      // }

      userExist.token = generateToken();
      await userExist.save();
      await AuthEmail.sendTokenResetPassword({
        name: userExist.name,
        email,
        token: userExist.token,
      });
      res.send("Check your email and follow instructions");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is error" });
    }
  };

  static checkToken =  (req: Request, res: Response) => {
    // const { token } = req.body;

    try {
    //   const existUserWithToken = await User.findOne({ where: { token: token } });
    //   if (!existUserWithToken) {
    //     const error = new Error("Incorrect token");
    //     res.status(404).json({ error: error.message });
    //     return;
    //   }

      res.send("correct token");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is error" });
    }
  };

  static resetPasswordWithPassword = async (req: Request, res: Response) => {
    const { token } = req.params;

    const { password } = req.body;

    try {
      const existUserWithToken = await User.findOne({ where: { token: token } });
      if (!existUserWithToken) {
        const error = new Error("Incorrect token");
        res.status(404).json({ error: error.message });
        return;
      }

      existUserWithToken.password = await hashPassword(password);
      existUserWithToken.token = null;
      await existUserWithToken.save();

      res.send("The password has been updated");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is error" });
    }
  };

  static getUSer = async (req: Request, res: Response) => {
      const{userExist} = req
      res.send(userExist)
  };

  static updatePassword = async(req: Request, res: Response)=>{
    const { current_password, new_password } = req.body;
    const { id } = req.userExist;

    try {
      const user = await User.findByPk(id);
      const isCorrectPassword = await checkPassword(
        current_password,
        user.password
      );

      if (!isCorrectPassword) {
        const error = new Error("Incorrect current password");
        res.status(401).json({ error: error.message });
        return;
      }
      user.password = await hashPassword(new_password);
      await user.save();

      res.send("The password has been updated");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is error" });
    }
  }

  static checkPassword = async(req: Request, res: Response)=>{

    const {current_password} = req.body
    const {id} = req.userExist

    try {
      const user = await User.findByPk(id)
      const isCorrectPassword= await checkPassword(current_password,user.password)

      if(!isCorrectPassword)
      {
        const error = new Error("Incorrect current password");
        res.status(401).json({ error: error.message });
        return;
      }
      res.send('The password is correct')
    } catch (error) {
       // console.log(error);
       res.status(500).json({ error: "There is error" });
    }

  }
}
