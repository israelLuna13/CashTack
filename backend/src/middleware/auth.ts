import { Request, Response, NextFunction } from 'express'
import { body, param} from 'express-validator'
import User from '../models/User'
declare global{
    namespace Express{
        interface Request{
            userToken?:User,
            userExist?:User
        }
    }
}
export const validateToken = async(req: Request, res: Response, next: NextFunction)=>{

    await body("token")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Token is required").run(req)

    next()

}

export const validateExistToken= async(req: Request, res: Response, next: NextFunction)=>{

    const { token } = req.body;
    try {
      const existUserWithToken = await User.findOne({
        where: { token: token },
      });
      if (!existUserWithToken) {
        const error = new Error("The token does not exist");
        res.status(409).json({ error: error.message });
        return;
      }
      req.userToken = existUserWithToken
      next()
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is error" });
    }
}

export const validateExistUser = async(req: Request, res: Response, next: NextFunction)=>{
  const { email } = req.body;

  try {
    const userExist = await User.findOne({ where: { email: email } });
      if (!userExist) {
        const error = new Error("User does not exist");
        res.status(404).json({ error: error.message });
        return;
      }
      req.userExist = userExist
      next()
  } catch (error) {}


}