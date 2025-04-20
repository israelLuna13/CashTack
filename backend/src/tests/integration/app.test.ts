import request from "supertest";
import server from "../../server";
import { AuthController } from "../../controllers/AuthController";
import { connectDB } from "../../config/connectionDatabse";
import User from "../../models/User";
import * as authUtils from "../../helper/auth";

import * as jwtUtilis from "../../helper/jtw"

describe("Authentitacion.createAccount", () => {
  beforeAll(async () => {
    await connectDB();
  });
  it("Should display validation errors when form is empty", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({});

    const createMock = jest.spyOn(AuthController, "createAccount");
    expect(response.status).toBe(400);
    expect(response.status).not.toBe(201);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(5);
    expect(response.body.errors).not.toHaveLength(3);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("Should return code 400 when the email is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "test",
        password: "12345678",
        email: "email_invalid",
      });

    const createMock = jest.spyOn(AuthController, "createAccount");
    expect(response.status).toBe(400);
    expect(response.status).not.toBe(201);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("E-mail is not valid");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors).not.toHaveLength(5);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("Should return code 400 when the password is less that characters", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "test",
        password: "1234",
        email: "test@test.com",
      });

    const createMock = jest.spyOn(AuthController, "createAccount");
    expect(response.status).toBe(400);
    expect(response.status).not.toBe(201);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe(
      "The password is very short, most has minium 8 characters"
    );

    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors).not.toHaveLength(5);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("Should create new user sucessfully ", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "test",
        password: "test123",
        email: "test@test.com",
      });

    expect(response.status).toBe(201);
    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });

  it("Should return code 409 when the user already registered", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "test",
        password: "test123",
        email: "test@test.com",
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("User already exist with these email");
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(201);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("Authentication.confirmAccount", () => {
  it("Should return display error if token is empty", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: ""
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("Token is required");
  });
  it("Should return display error if token is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "not_valid",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "The token does not exist");
  });

  it("should confirm account when token is correct", async () => {
    //take token from controller before data of database beening deleted
    const token = globalThis.cashTrackerConfirmationToken;
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token,
      });
    expect(response.status).toBe(200);
    expect(response.text).toEqual("User successfully confirmedy");
  });
});

describe('AUthentication',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('Should display validation error when the form is empty',async()=>{

    const response = await request(server).post('/api/auth/login').send({})
    const mocklogin = jest.spyOn(AuthController,'login')

    expect(response.status).toBe(400)
    expect(response.status).not.toBe(200)
    expect(response.body.errors).toHaveLength(2)
    expect(response.body).toHaveProperty('errors')
    expect(mocklogin).not.toHaveBeenCalled()

  })


  it('Should return 400 bad request when the email is invalid',async()=>{

    const response = await request(server).post('/api/auth/login').send({
      password:'123456',
      email:'not_valid'
    })
    const mocklogin = jest.spyOn(AuthController,'login')

    expect(response.status).toBe(400)
    expect(response.status).not.toBe(200)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Email is not valid')
    expect(response.body).toHaveProperty('errors')
    expect(mocklogin).not.toHaveBeenCalled()

  })

  it("Should return 404 and display error when user does not exist in the middleware", async () => {
    const response = await request(server).post("/api/auth/login").send({
      password: "123456",
      email: "userNotExist@gmail.com",
    });
    const mocklogin = jest.spyOn(AuthController, "login");

    expect(response.status).toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error", "User does not exist");
    expect(mocklogin).not.toHaveBeenCalled();
  });


  it("Should return 403 and display error when account is not confirmed with mock", async () => {

    (jest.spyOn(User,'findOne')as jest.Mock).mockResolvedValue({
      id:1,
      confirmed:false,
      password:'hashpassword',
      email:'userNotConfirmed@gmail.com'
    })
    const response = await request(server).post("/api/auth/login").send({
      password: "123456",
      email: "userNotExist@gmail.com",
    });
    expect(response.status).toBe(403);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error", "You have not confirm your account");
  });

  it("Should return 403 and display error when account is not confirmed", async () => {

   const userData = {
    name:'Test',
    email:'userNotExist@gmail.com',
    password:'123456'
   };

   (await request(server).post('/api/auth/login').send(userData));
    const response = await request(server).post("/api/auth/login").send({
      password: "123456",
      email: "userNotExist@gmail.com",
    });
    expect(response.status).toBe(403);
    expect(response.status).not.toBe(200);
    expect(response.status).not.toBe(404);
    expect(response.body).toHaveProperty("error", "You have not confirm your account");
  });

  it("Should return 401 and display error when password is incorrect", async () => {


    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hashpassword",
    });

    const checkPassword = jest
      .spyOn(authUtils, "checkPassword")
      .mockResolvedValue(false);
    const response = await request(server).post("/api/auth/login").send({
      password: "wrongpassword",
      email: "test@gmail.com",
    });
    expect(response.status).toBe(401);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error", "Incorrect password");

    expect(findOne).toHaveBeenCalled();
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalled();
    expect(checkPassword).toHaveBeenCalledTimes(1);
  });


  it("Should return 401 and display error when password is incorrect", async () => {


    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hashpassword",
    });

    const checkPassword = jest
      .spyOn(authUtils, "checkPassword")
      .mockResolvedValue(true);


      const generateJWT = (jest.spyOn(jwtUtilis,'generateJWT').mockReturnValue('jsonwebtokenfalse'))


    const response = await request(server).post("/api/auth/login").send({
      password: "correctpassword",
      email: "test@gmail.com",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual('jsonwebtokenfalse');
    expect(findOne).toHaveBeenCalled();
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalled();
    expect(checkPassword).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledWith('correctpassword','hashpassword');
    expect(generateJWT).toHaveBeenCalled();
    expect(generateJWT).toHaveBeenCalledTimes(1);
    expect(generateJWT).toHaveBeenCalledWith(1);
  });


})
