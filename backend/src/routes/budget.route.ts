import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
// import { handleInputsErrors } from "../middleware/validation";
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseExist, validateExpenseId, validateExpenseInput } from "../middleware/expense";
import { handleInputsErrors } from "../middleware/validation";
 const router = Router()

// ALL ROUTES HAVE MIDDLWARE WITH CODE THTA WOULD MOST IN THE CONTROLLER, THIS DID TO REDUCER CODE IN THE CONTROLLER

 export default router
//---------------------------------------------------------------------
 //we add the next middleware to routes that has the id called budgetId
 router.param('budgetId',validateBudgetId)
 router.param('budgetId',validateBudgetExist)

//---------------------------------------------------------------------

 //we add the next middleware to routes that has the id called expenseId
 router.param('expenseId',validateExpenseId)
 router.param('expenseId',validateExpenseExist)

  //-----------------------------------------------------------------budget routes-----------------------------------------------------------------

 router.get('/',BudgetController.getAll)
 
 router.post('/',validateBudgetInput,handleInputsErrors,BudgetController.createBudget)

 router.get("/:budgetId",validateBudgetId, BudgetController.getBudgetById);
 
 router.put("/:budgetId",validateBudgetId,validateBudgetInput,handleInputsErrors,BudgetController.editBudgetByID);
 
 router.delete('/:budgetId',validateBudgetId,BudgetController.deleteBudgetByID)

 //-----------------------------------------------------------------Expenses routes-----------------------------------------------------------------
//  router.get("/:budgetId/expenses",ExpensesController.getAll)
 router.post("/:budgetId/expenses",validateExpenseInput,handleInputsErrors,ExpensesController.crate)

 router.get("/:budgetId/expenses/:expenseId",ExpensesController.getExpenseById)

 router.put("/:budgetId/expenses/:expenseId",validateExpenseInput,handleInputsErrors,ExpensesController.editExpenseById)
 
 router.delete("/:budgetId/expenses/:expenseId",ExpensesController.deleteExpenseById)