import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
// import { handleInputsErrors } from "../middleware/validation";
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from "../middleware/budget";
 const router = Router()

 export default router
//---------------------------------------------------------------------
 //we add the next middleware to routes that has the id called budgetId
 router.param('budgetId',validateBudgetId)
 router.param('budgetId',validateBudgetExist)
 //---------------------------------------------------------------------

 router.get('/',BudgetController.getAll)
 
 router.post('/',validateBudgetInput,BudgetController.createBudget)

 router.get("/:budgetId",validateBudgetId, BudgetController.getBudgetById);
 
 router.put("/:budgetId",validateBudgetId,validateBudgetInput,BudgetController.editBudgetByID);
 
 router.delete('/:budgetId',validateBudgetId,BudgetController.deleteBudgetByID)