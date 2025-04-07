import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocs/budget";
import { BudgetController } from "../../controllers/BudgetController";
import Budget from "../../models/Budget";

//WE USE CREATEREQUEST AND CREATERESPONSE TO MAKE SIMULATION REAL FETCHING

//create a false function, this function will be controller by jest
jest.mock("../../models/Budget", () => ({
  findAll: jest.fn(),
}));

describe("BudgetController.getAll", () => {

  //will execute beforeEach before execute each test
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset(); //reset mock when ended

    //this is like query to  get all data by user of database
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const updatedBudget = budgets.filter(
        (budget) => budget.userId === options.where.userId
      );

      //return data like bring batabase
      return Promise.resolve(updatedBudget);
    });
  });


  it("Should retrieve 2 budgets for user with ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      userExist: { id: 1 },
    });

    const res = createResponse();

    //   const updatedBudget = budgets.filter(budget=>budget.userId === req.userExist.id);

    // (Budget.findAll as jest.Mock).mockResolvedValue(updatedBudget);


    await BudgetController.getAll(req, res);//execute false function

    const data = res._getJSONData();

    expect(data).toHaveLength(2);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
  });

  it("Should retrieve 1 budgets for user with ID 2", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      userExist: { id: 2 },
    });
    const res = createResponse();

    //    const updatedBudget = budgets.filter(budget => budget.userId === req.userExist.id);

    //    (Budget.findAll as jest.Mock).mockResolvedValue(updatedBudget)

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(1);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
  });

  it("Should retrieve 0 budgets for user with ID 900", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      userExist: { id: 900 },
    });
    const res = createResponse();

    // const updatedBudget = budgets.filter(budget => budget.userId === req.userExist.id);

    // (Budget.findAll as jest.Mock).mockResolvedValue(updatedBudget)

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(0);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
  });

  it('Should handle error when fetching budgets', async()=>{
    const req = createRequest({
        method: "GET",
        url: "/api/budgets",
        userExist: { id: 900 },
      });
      const res = createResponse();

      (Budget.findAll as jest.Mock).mockRejectedValue(new Error)//make a error

      await BudgetController.getAll(req, res);
      expect(res.statusCode).toBe(500)
      expect(res._getJSONData()).toStrictEqual({error:'There is error'})
  })
});
