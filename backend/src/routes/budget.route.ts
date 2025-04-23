import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
// import { handleInputsErrors } from "../middleware/validation";
import { HasAcces, validateBudgetExist, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseExist, validateExpenseId, validateExpenseInput } from "../middleware/expense";
import { handleInputsErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
 const router = Router()

// ALL ROUTES HAVE MIDDLWARE WITH CODE THTA WOULD MOST IN THE CONTROLLER, THIS DID TO REDUCER CODE IN THE CONTROLLER

 router.use(authenticate)
//---------------------------------------------------------------------
 //we add the next middleware to routes that has the id called budgetId
 router.param('budgetId',validateBudgetId)
 router.param('budgetId',validateBudgetExist)

 router.param('budgetId',HasAcces)// this middleware need data of authenticate and validateBudgetExist

//---------------------------------------------------------------------

 //we add the next middleware to routes that has the id called expenseId
 router.param('expenseId',validateExpenseId)
 router.param('expenseId',validateExpenseExist)

  //-----------------------------------------------------------------budget routes-----------------------------------------------------------------
/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Get all budgets of user
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user budgets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Food
 *                   amount:
 *                     type: integer
 *                     example: 100
 *                   expenses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 10
 *                         name:
 *                           type: string
 *                           example: Pizza
 *                         amount:
 *                           type: integer
 *                           example: 25
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

 router.get('/',BudgetController.getAll)
 

 /**
 * @swagger
 * /api/budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Food
 *               amount:
 *                 type: number
 *                 example: 200
 *     responses:
 *       201:
 *         description: Budget created successfully.
 *       400:
 *         description: Validation error - Missing or invalid fields.
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
 router.post('/',validateBudgetInput,handleInputsErrors,BudgetController.createBudget)


 /**
 * @swagger
 * /api/budgets/{budgetId}:
 *   get:
 *     summary: Get a budget by ID with its expenses
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to retrieve
 *     responses:
 *       200:
 *         description: Budget retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Food
 *                 amount:
 *                   type: number
 *                   example: 300
 *                 expenses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       name:
 *                         type: string
 *                         example: Groceries
 *                       amount:
 *                         type: number
 *                         example: 100
 *       400:
 *         description: Invalid budget ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Internal server error
 */
 router.get("/:budgetId",validateBudgetId, BudgetController.getBudgetById);
 
 /**
 * @swagger
 * /api/budgets/{budgetId}:
 *   put:
 *     summary: Update a budget by ID
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rent
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Budget updated successfully
 *       400:
 *         description: Invalid budget ID or input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Internal server error
 */

 router.put("/:budgetId",validateBudgetId,validateBudgetInput,handleInputsErrors,BudgetController.editBudgetByID);
 /**
 * @swagger
 * /api/budgets/{budgetId}:
 *   delete:
 *     summary: Delete a budget by ID
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to delete
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Budget deleted successfully
 *       400:
 *         description: Invalid budget ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Internal server error
 */
 router.delete('/:budgetId',validateBudgetId,BudgetController.deleteBudgetByID)

 //-----------------------------------------------------------------Expenses routes-----------------------------------------------------------------
//  router.get("/:budgetId/expenses",ExpensesController.getAll)

/**
 * @swagger
 * /api/budgets/{budgetId}/expenses:
 *   post:
 *     summary: Add an expense to a budget
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to which the expense will be added
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electricity
 *               amount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Expense added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense added successfully
 *       400:
 *         description: Invalid expense data or budget ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Internal server error
 */

 router.post("/:budgetId/expenses",validateExpenseInput,handleInputsErrors,ExpensesController.crate)

 /**
 * @swagger
 * /api/budgets/{budgetId}/expenses/{expenseId}:
 *   get:
 *     summary: Get a specific expense from a budget
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the budget
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense to retrieve
 *     responses:
 *       200:
 *         description: Expense retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: Rent
 *                 amount:
 *                   type: number
 *                   example: 750
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid budget or expense ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */

 router.get("/:budgetId/expenses/:expenseId",ExpensesController.getExpenseById)

 /**
 * @swagger
 * /api/budgets/{budgetId}/expenses/{expenseId}:
 *   put:
 *     summary: Edit an expense from a budget
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the budget
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Groceries
 *               amount:
 *                 type: number
 *                 example: 150
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense updated successfully
 *       400:
 *         description: Validation error or invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */

 router.put("/:budgetId/expenses/:expenseId",validateExpenseInput,handleInputsErrors,ExpensesController.editExpenseById)
 

 /**
 * @swagger
 * /api/budgets/{budgetId}/expenses/{expenseId}:
 *   delete:
 *     summary: Delete an expense from a budget
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the budget
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense to delete
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */

 router.delete("/:budgetId/expenses/:expenseId",ExpensesController.deleteExpenseById)

 export default router
