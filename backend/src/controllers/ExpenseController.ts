import { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpensesController {
  static crate = async (req: Request, res: Response) => {
    //const {budgetId} = req.params
    try {
      const expense = await Expense.create(req.body);
      expense.budgetId = req.budget.id;//make relation to the budget
      await expense.save();
      res.status(201).json("Expense added sucessfully");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is an error" });
    }
  };

  static getExpenseById = async (req: Request, res: Response) => {
    
      res.json(req.expense);
   
  };
  static editExpenseById = async (req: Request, res: Response) => {
    const { expense } = req;
    try {
      await expense.update(req.body);
      res.json("Expense updated successfully");
    } catch (error) {
      //console.log(error);
      res.status(500).json({ error: "There is an error" });
    }
  };
  static deleteExpenseById = async (req: Request, res: Response) => {
    const { expense } = req;
    try {
      await expense.destroy();

      res.json("Expenses deleted successfully");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There is an error" });
    }
  };
}
