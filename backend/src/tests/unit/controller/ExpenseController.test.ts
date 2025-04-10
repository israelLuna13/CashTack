import { createRequest, createResponse, Mocks } from "node-mocks-http";

import Expense from "../../../models/Expense";
import { ExpensesController } from "../../../controllers/ExpenseController";
import { expenses } from "../../mocs/expenses";

//make crate like false function
jest.mock("../../../models/Expense", () => ({
  create: jest.fn(),
  update:jest.fn(),
  destroy:jest.fn()
}));

describe("ExpenseController.create", () => {

  it("Should create new expense", async () => {

    const expenseMock = {
      save: jest.fn(),
    };

    (Expense.create as jest.Mock).mockResolvedValue(expenseMock);

    const req = createRequest({
      method: "POST",
      url: "/api/budget/:budgetID/expenses",
      body: { name: "Test Expense", amount: 300 },
      budget: { id: 1 },
    });

    const res = createResponse();
    await ExpensesController.crate(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(201);
    expect(data).toEqual("Expense added sucessfully");
    expect(expenseMock.save).toHaveBeenCalledTimes(1);
    expect(expenseMock.save).toHaveBeenCalled();
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });

  it("Should create new error", async () => {
    const expenseMock = {
      save: jest.fn(),
    };
    (Expense.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/budget/:budgetID/expenses",
      body: { name: "Test Expense", amount: 300 },
      budget: { id: 1 },
    });

    const res = createResponse();
    await ExpensesController.crate(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).not.toBe(201);
    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "There was a error" });
    expect(expenseMock.save).not.toHaveBeenCalled();
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });
});

describe("ExpenseController.getById", () => {
  it("Should return expense with ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budget/:budgetID/expenses/:expenseID",
      expense: expenses[0],
    });

    const res = createResponse();

    await ExpensesController.getExpenseById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toEqual(expenses[0]);
  });
});

describe("ExpenseController.updateExpense", () => {
  it("Should update expense", async () => {
    const expenseMock = {
      ...expenses[0],
     update: jest.fn(),
    };

    (expenseMock.update as jest.Mock).mockResolvedValue(expenseMock);

    const req = createRequest({
      method: "PUT",
      url: "/api/budget/:budgetID/expenses/:expenseID",
      body: { name: "Test Expense", amount: 300 },
      expense: expenseMock,
    });
    const res = createResponse();

    await ExpensesController.editExpenseById(req, res);

    const data = res._getJSONData();
    
    expect(res.statusCode).toBe(200);
    expect(data).toEqual("Expense updated successfully");
    expect(expenseMock.update).toHaveBeenCalled();
    expect(expenseMock.update).toHaveBeenCalledTimes(1);
    expect(expenseMock.update).toHaveBeenCalledWith(req.body);
  });

  it("Should create new error when update expense", async () => {

    (Expense.update as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "PUT",
      url: "/api/budget/:budgetID/expenses/:expenseID",
      body: { name: "Test Expense", amount: 300 },
      expense: expenses[0],
    });

    const res = createResponse();

    await ExpensesController.editExpenseById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "There was a error" });
    expect(Expense.update).not.toHaveBeenCalled();
  });
});

describe("ExpenseController.delete", () => {
  it("Should destroy expense", async () => {
    const expenseMock = {
      ...expenses[0],
      destroy: jest.fn(),
    };
    (expenseMock.destroy as jest.Mock).mockResolvedValue(expenseMock);

    const req = createRequest({
      method: "DELETE",
      url: "/api/budget/:budgetID/expenses/:expenseID",
      expense: expenseMock,
    });

    const res = createResponse();

    await ExpensesController.deleteExpenseById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toEqual("Expenses deleted successfully");
    expect(expenseMock.destroy).toHaveBeenCalled();
    expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
  });

  it("Should create a new error when delete expense", async () => {
    const expenseMock = {
      ...expenses[0],
      destroy: jest.fn(),
    };
    (expenseMock.destroy as jest.Mock).mockRejectedValue(new Error())
    const req = createRequest({
      method: "DELETE",
      url: "/api/budget/:budgetID/expenses/:expenseID",
      expense: expenses[0],
    });

    const res = createResponse();

    await ExpensesController.deleteExpenseById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "There was a error" });
    expect(Expense.destroy).not.toHaveBeenCalled();
  });
});
