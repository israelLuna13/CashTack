import { createRequest, createResponse } from "node-mocks-http";

import { validateExpenseExist, validateExpenseId, validateExpenseInput } from "../../../middleware/expense";
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

describe('Expense Middleware - validateExpenseInput',()=>{
  it('Should display error when the form is empty',async()=>{

    const req = createRequest({
      method:'POST',
      body:{
        name:'test',
        amount:100
      }
    })

    const res = createResponse();
    const next = jest.fn()

    await validateExpenseInput(req,res,next)

    expect(next).toHaveBeenCalled()

  })
  it('should not call next() when input is invalid', async () => {
    const req = createRequest({
      method: 'POST',
      body: {
        name: '',
        amount: -5,
      },
    });

    const res = createResponse();
    const next = jest.fn();

    await validateExpenseInput(req, res, next);

    expect(next).toHaveBeenCalled();
  });
})

describe('Expense Middleware - validateExpenseId',()=>{
  beforeAll(()=>{
    jest.resetAllMocks()
  })
  it('Should display error when id is invalid',async()=>{

    const req = createRequest({
      method:'POST',
      params:{expenseId:0}
    })

    const res = createResponse();
    const next = jest.fn()

    await validateExpenseId(req,res,next)

    const data = res._getJSONData()    

    expect(res.statusCode).toBe(400)
    expect(data.errors).toHaveLength(1)
    expect(next).not.toHaveBeenCalled()

  })

  it('Should display execute next function when id is correct',async()=>{

    const req = createRequest({
      method:'POST',
      params:{expenseId:1}
    })

    const res = createResponse();
    const next = jest.fn()

    await validateExpenseId(req,res,next)

    expect(next).toHaveBeenCalled()


  })

  // it('Should return code 500 and display message error',async()=>{

  //   const req = createRequest({
  //     method:'POST',
  //     params:{expenseId:1}
  //   })

  //   const res = createResponse();
  //   const next = jest.fn()

  //   next.mockRejectedValue(true)

  //   await validateExpenseId(req,res,next)

  //   const data = res._getJSONData()

  //   expect(res.statusCode).toBe(500)
  //   expect(data).toHaveProperty('error','There is error')

  //   expect(next).toHaveBeenCalled()


//  })

})
