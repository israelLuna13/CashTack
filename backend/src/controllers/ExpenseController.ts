import { Request, Response } from "express";
import Expense from "../models/Expense";

//ALL VALIDATION OF PARAMS AND BODY VALIDATION IS IN THE MIDDLEWARE

export class ExpensesController {
  // static getAll = async (req: Request, res: Response) => {};
  static crate = async (req: Request, res: Response) => {
    //const {budgetId} = req.params
    try {
      const expense = new Expense(req.body);
      expense.budgetId = req.budget.id;//make relation to the budget
      await expense.save();
      res.status(201).json("Expense added sucessfully");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There was a error" });
    }
  };

  static getExpenseById = async (req: Request, res: Response) => {
    try {
      res.json(req.expense);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There was a error" });
    }
  };
  static editExpenseById = async (req: Request, res: Response) => {
    const { expense } = req;
    try {
      await expense.update(req.body);
      res.json("Expense updated successfully");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There was a error" });
    }
  };
  static deleteExpenseById = async (req: Request, res: Response) => {
    const { expense } = req;
    try {
      await req.expense.destroy();

      res.json("Expenses deleted successfully");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "There was a error" });
    }
  };
}
