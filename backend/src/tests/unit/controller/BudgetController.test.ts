import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../../mocs/budget";
import { BudgetController } from "../../../controllers/BudgetController"; 
import Budget from "../../../models/Budget";
import Expense from "../../../models/Expense";
//WE USE CREATEREQUEST AND CREATERESPONSE TO MAKE SIMULATION REAL FETCHING

//create a false function, this function will be controller by jest
jest.mock("../../../models/Budget", () => ({
  findAll: jest.fn(),
  create:jest.fn(),
  findByPk:jest.fn()
}));

describe("BudgetController.getAll", () => {

  //will execute beforeEach before execute each test
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset(); //reset mock when each test end
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

    await BudgetController.getAll(req, res);//execute function with test data and call beforeach
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

describe("BudgetController.create", ()=>{

  it('Should create a new budget and respond with statusCode 201', async()=>{

    //make available methodt save and execute success
    const mockBudget={
      save:jest.fn()
    };

    (Budget.create as jest.Mock).mockResolvedValue(mockBudget)

    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      userExist: { id: 1 },
      body:{name:'test budget',amount:200}
    });

    const res = createResponse();

    await BudgetController.createBudget(req, res);//execute false function

    const data = res._getJSONData();
    expect(res.statusCode).toBe(201)
    expect(data).toBe('Budget created successfully')
    expect(mockBudget.save).toHaveBeenCalled()
    expect(mockBudget.save).toHaveBeenCalledTimes(1)
    expect(Budget.create).toHaveBeenCalledWith(req.body)
  })

  it('Should handle error when create budget with statusCode 500', async()=>{
     //make available methodt save
     const mockBudget={
      save:jest.fn()
    };

    (Budget.create as jest.Mock).mockRejectedValue(new Error)

    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      userExist: { id: 1 },
      body:{name:'test budget',amount:200}
    });

    const res = createResponse();

    await BudgetController.createBudget(req, res);//execute false function

    const data = res._getJSONData();
    expect(res.statusCode).toBe(500)
    expect(data).toEqual({error:'There is error'})

    expect(mockBudget.save).not.toHaveBeenCalled()
    expect(Budget.create).toHaveBeenCalledWith(req.body)
   
  })
})

describe("BudgetController.getById", () => {
  //will execute beforeEach before execute each test
  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockReset(); //reset mock when ended

    //this is like query to  get all data by user of database
    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      const budget = budgets.filter(budget => budget.id === id)[0]
      return Promise.resolve(budget)
    });
  });

  test("should return a budget with ID 1 and 3 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      budget: { id: 1 },
    });
  
    const res = createResponse();
 
    
    await BudgetController.getBudgetById(req, res); //execute false function
    const data = res._getJSONData()

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(3)    
    expect(Budget.findByPk).toHaveBeenCalled()
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id,{
      include:[Expense]
    })
  });

  test("should return a budget with ID 2 and 2 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      budget: { id: 2 },
    });
  
    const res = createResponse();
 
    
    await BudgetController.getBudgetById(req, res); //execute false function
    const data = res._getJSONData()

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(2)    
    expect(Budget.findByPk).toHaveBeenCalled()
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id,{
      include:[Expense]
    })
  });

  test("should return a budget with ID 3 and 0 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      budget: { id: 3 },
    });
  
    const res = createResponse();
 
    
    await BudgetController.getBudgetById(req, res); //execute false function
    const data = res._getJSONData()

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(0)
    expect(Budget.findByPk).toHaveBeenCalled()
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id,{
      include:[Expense]
    })
  });
});

describe("BudgetController.update",()=>{
  test("should update the budget and return a sucess message",async()=>{

    const budgetMock={
      update:jest.fn()
    }

    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId",
      userExist: { id: 1 },
      budget:budgetMock,
      body:{name:'test budget',amount:200}
    });

    const res = createResponse();

    await BudgetController.editBudgetByID(req, res);//execute false function

    const data = res._getJSONData()

    expect(res.statusCode).toBe(200)
    expect(data).toBe('Budget updated successfully')
    expect(budgetMock.update).toHaveBeenCalled()
    expect(budgetMock.update).toHaveBeenCalledTimes(1)
    expect(budgetMock.update).toHaveBeenCalledWith(req.body)
  })
})

describe("BudgetController.destroy",()=>{
  test("should delete the budget and return a sucess message",async()=>{

    const budgetMock={
      destroy:jest.fn()
    }

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId",
      userExist: { id: 1 },
      budget:budgetMock,
    });

    const res = createResponse();

    await BudgetController.deleteBudgetByID(req, res);//execute false function

    const data = res._getJSONData()

    expect(res.statusCode).toBe(200)
    expect(data).toBe('Budget deleted successfully')
    expect(budgetMock.destroy).toHaveBeenCalled()
    expect(budgetMock.destroy).toHaveBeenCalledTimes(1)
  })
})