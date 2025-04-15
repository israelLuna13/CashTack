import { createRequest, createResponse } from "node-mocks-http";

import { validateExpenseExist } from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocs/expenses";
import { budgets } from "../../mocs/budget";
import { HasAcces } from "../../../middleware/budget";

jest.mock("../../../models/Expense", () => ({
  findByPk: jest.fn(),
}));

describe("Middleware expenseExist", () => {
  beforeEach(() => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      const expense = expenses.filter((exp) => exp.id === id)[0] ?? null;
      return Promise.resolve(expense);
    });
  });

  test("Should handle a non-existent expense", async () => {
    const req = createRequest({
      params: {
        expenseId: 120,
      },
    });
    const res = createResponse();

    const next = jest.fn();
    await validateExpenseExist(req, res, next);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(404);
    expect(data).toEqual({ error: "The expense do not exist" });
    expect(next).not.toHaveBeenCalled();
  });

  it("Should call next when expense exist", async () => {
    const req = createRequest({
      params: {
        expenseId: 1,
      },
    });
    const res = createResponse();

    const next = jest.fn();
    await validateExpenseExist(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.expense).toEqual(expenses[0]);
  });

  it("Should handle internal error server", async () => {
    (Expense.findByPk as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      params: {
        expenseId: 1,
      },
    });
    const res = createResponse();

    const next = jest.fn();
    await validateExpenseExist(req, res, next);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "There is error" });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("Expenses Middleware - validateExpenseExist", () => {
  it("Should prevent unauthorized users from adding expenses", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      budget: budgets[0],
      userExist: { id: 20 },
      body: { name: "test expense", amount: 400 },
    });

    const res = createResponse();
    const next = jest.fn();

    HasAcces(req, res, next);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
    expect(data).toEqual({ error: "Invalid action" });
  });
});
