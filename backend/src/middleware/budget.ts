import { Request, Response, NextFunction } from 'express'
import { validationResult,param ,body} from 'express-validator'
import Budget from '../models/Budget';

declare global {
    namespace Express{
        //overwrite require for shared information middlware to moddleware
        interface Request{
            budget?:Budget
        }
    }
}

//TODO:MAKE TESTO TO  validateBudgetId,validateBudgetInput
export const validateBudgetId = async(req: Request, res: Response, next: NextFunction)=>{

 await param("budgetId")
   .isInt()
   .withMessage("ID is not valid")
   .notEmpty()
   .withMessage("ID is required")
   .custom((value) => value > 0)
   .withMessage("The ID most be over 0").run(req); 

    let errors = validationResult(req)
    if(!errors.isEmpty()){
         res.status(400).json({errors:errors.array()})
         return
    }
    next()
}

export const validateBudgetExist = async(req: Request, res: Response, next: NextFunction)=>{

    const {budgetId} = req.params

    try {
        const budget = await Budget.findByPk(budgetId)
        if(!budget){
            const error = new Error('The budget do not exist')
            res.status(404).json({error:error.message})
            return
        }

        //make available the budget to other middlewares
        req.budget = budget
        next()
       } catch (error) {
          //console.log(error);
          res.status(500).json({error:'There is error'})
       }

       }

export const validateBudgetInput= async(req: Request, res: Response, next: NextFunction)=>{

    await body('name').notEmpty().withMessage("The name budget is required").run(req)

    await body("amount")
      .notEmpty()
      .withMessage("The amount is required")
      .isNumeric()
      .withMessage("The amount is not valid")
      .custom((value) => value > 0)
      .withMessage("The budget most be over 0")
      .run(req);

    // let errors = validationResult(req)

    // if(!errors.isEmpty()){
    //     res.status(400).json({errors:errors.array()})
    //     return
    // }
    next()
}
//middleware to check if one user has key to modify, delete , get or update data
//if the user is the same one who created the data 
export function HasAcces(req: Request, res: Response, next: NextFunction){
    if(req.budget.userId !== req.userExist.id){
        const error = new Error("Invalid action")
        res.status(401).json({error:error.message})
        return
    }
    next()
}