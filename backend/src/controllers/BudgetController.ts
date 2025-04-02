import type {Request,Response} from "express"
import Budget from "../models/Budget";
import Expense from "../models/Expense";
//ALL VALIDATION OF PARAMS AND BODY VALIDATION IS IN THE MIDDLEWARE

export class BudgetController{

    static getAll = async (req:Request,res:Response)=>{
        try {
            //TODO: validate if there aren't budgets
            const budgets = await Budget.findAll({
                order:[
                    ['createdAt','DESC']
                ],
                //TODO: filter by auth user
                // limit:1,

                // where:{
                //     name:'food'

                // }
            })
            res.json(budgets)
        } catch (error) {
            //console.log(error);
           res.status(500).json({error:'There is error'})
        }
    }

    static createBudget = async (req:Request,res:Response)=>{
       try {
            const bubdget = new Budget(req.body)// instance model
            await bubdget.save()
            res.status(201).json('Budget created successfully')

       } catch (error) {
          //console.log(error);
          res.status(500).json({error:'There is error'})
       }
        
    }

    static getBudgetById = async (req:Request,res:Response)=>{

        //the code that would be here, we set the code in the middleware

    //    const {id} = req.params
    //    try {
    //     const budget = await Budget.findByPk(id)
    //     if(!budget){
    //         const error = new Error('The budget do not exist')
    //         res.status(400).json({error:error.message})
    //         return
    //     }
    //     res.json(budget)
        
    //    } catch (error) {
    //       //console.log(error);
    //       res.status(500).json({error:'There is error'})
    //    }

    //the budget is in the request
    //get the budget with all their expenses
    const budget = await Budget.findByPk(req.budget.id,{
        include:[Expense]
    })

        res.json(budget)
    }

    static editBudgetByID = async (req:Request,res:Response)=>{
        //the budget is in the request
        const {budget} = req
        await budget.update(req.body)
        res.json("Budget updated successfully")
    }

    static deleteBudgetByID = async (req:Request,res:Response)=>{
    //the budget is in the request
        const {budget} = req
        await budget.destroy()
        res.json("Presupuesto deleted successfully")
    }
 

}