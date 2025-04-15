import { Request, Response, NextFunction } from 'express'
import { validationResult ,body, param} from 'express-validator'
import Expense from '../models/Expense';

declare global {
  namespace Express{
      //overwrite the require for shared information middlware to controller
      interface Request{
          expense?:Expense
      }
  }
}

export const validateExpenseInput= async(req: Request, res: Response, next: NextFunction)=>{

    await body('name').notEmpty().withMessage("The name expense is required").run(req)

    await body("amount")
      .notEmpty()
      .withMessage("The amount is required")
      .isNumeric()
      .withMessage("The amount is not valid")
      .custom((value) => value > 0)
      .withMessage("The expense most be over 0")
      .run(req);

    //catch posibility errors
    // let errors = validationResult(req)

    // if(!errors.isEmpty()){
    //     res.status(400).json({errors:errors.array()})
    //     return
    // }
    next()
}

export const validateExpenseId=async(req: Request, res: Response, next: NextFunction)=>{

  try {
    await param("expenseId")
      .isInt()
      .custom((value) => value > 0)
      .withMessage("Id is incorrect")
      .run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "There is error" });
  }
}

export const validateExpenseExist = async(req: Request, res: Response, next: NextFunction)=>{

  const {expenseId} = req.params

  try {
      const expense = await Expense.findByPk(expenseId)
      if(!expense){
          const error = new Error('The expense do not exist')
          res.status(404).json({error:error.message})
          return
      }

      //make available the expense to other middlewares
      req.expense = expense
      next()
     } catch (error) {
        //console.log(error);
        res.status(500).json({error:'There is error'})
     }

     }