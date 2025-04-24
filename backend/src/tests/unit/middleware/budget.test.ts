import { createResponse, createRequest } from "node-mocks-http";
import { HasAcces, validateBudgetExist } from "../../../middleware/budget";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocs/budget";

//create a false function, this function will be controller by jest
jest.mock("../../../models/Budget", () => ({
  findByPk: jest.fn(),
}));

describe("middleware budget budgetExist.", () => {

  it("Should handle non-existent budget", async () => {
    
    (Budget.findByPk as jest.Mock).mockResolvedValue(null);//make findByPk does not find budget

    const req = createRequest({
      params: {
      //  budgetId: 1,
        budgetId: budgets[4],
      },
    });

    const res = createResponse();

    const next = jest.fn();//work like real nextfunction

    await validateBudgetExist(req, res, next);//execute

    const data = res._getJSONData();

    expect(res.statusCode).toBe(404);
    expect(data).toEqual({ error: "The budget do not exist" });

    expect(next).not.toHaveBeenCalled();
  });

  it("Should proceed to next middleware if budget exist", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[1]);
    const req = createRequest({
      params: {
        budgetId: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();

    await validateBudgetExist(req, res, next);

    expect(next).toHaveBeenCalled();

    expect(req.budget).toEqual(budgets[1]);
  });

  it("Should handle error", async () => {
    (Budget.findByPk as jest.Mock).mockRejectedValue(new Error); // go to catch
    const req = createRequest({
      params: {
        budgetId: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();

    await validateBudgetExist(req, res, next);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "There is an error" });

    expect(next).not.toHaveBeenCalled();
  });
});

describe("middleware budget HasAccess", () => {
  it("Should make error for diferents ID", async () => {

    //budget and userExist has diferents id and will make error
    const req = createRequest({
      // budget:{
      //     userId:1
      // },
      budget: budgets[0],
      userExist: {
        id: 2,
      },
    });
    const res = createResponse();
    const next = jest.fn();

    HasAcces(req, res, next);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(401);
    expect(data).toEqual({ error: "Invalid action" });
    expect(next).not.toHaveBeenCalled();
  });

  it("Should execute next because ID are same", async () => {
    const req = createRequest({
      // budget:{
      //     userId:1
      // },
      budget: budgets[0],
      userExist: {
        id: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();

    HasAcces(req, res, next);
    // const data = res._getJSONData()

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
