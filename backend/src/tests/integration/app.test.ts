import request from "supertest";
import server from "../../server";
import { AuthController } from "../../controllers/AuthController";
import { connectDB } from "../../config/connectionDatabse";

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
