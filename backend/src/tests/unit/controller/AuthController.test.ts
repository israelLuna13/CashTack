import { createRequest,createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
import { checkPassword, hashPassword } from "../../../helper/auth";
import { generateToken } from "../../../helper/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJWT } from "../../../helper/jtw";

jest.mock('../../../models/User')
jest.mock('../../../helper/auth')
jest.mock('../../../helper/token')
jest.mock("../../../helper/jtw")
describe('AuthController.createAccount',()=>{
    //reset mocks before to execute each test
    beforeEach(()=>{
        jest.resetAllMocks()
    })

    it('Should return 409 status and an error message if the email is already registered',async()=>{

        (User.findOne as jest.Mock).mockResolvedValue(true)

        const req = createRequest({
            method:'POST',
            url:"/api/auth/create-account",
            body:{
                email:'test@gmail.com',
                password:'123456',
                name:'test'
            }
        })

        const res = createResponse();

        await AuthController.createAccount(req,res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(409)
     //   expect(data).toEqual({error:'User already exist with these email'})
        expect(data).toHaveProperty('error','User already exist with these email')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)

    })

    it('Should register a new user and return success message',async()=>{

        const req = createRequest({
            method:'POST',
            url:"/api/auth/create-account",
            body:{
                email:'test@gmail.com',
                password:'123456',
                name:'test'
            }
        })

        const res = createResponse();
       
        const mockUser = {...req.body,save:jest.fn()};

        //mockRejectedValue is to async function
        //mockReturnValue is not async function

        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue('hashpasswordtest');
        (generateToken as jest.Mock).mockReturnValue('123456');

        //we use spyOn to call method sendConfirmationEmail because AuthEmail is a class
        jest.spyOn(AuthEmail,'sendConfirmationEmail').mockImplementation(()=> Promise.resolve())


      await AuthController.createAccount(req,res)
      const data = res._getJSONData()

      expect(User.create).toHaveBeenCalled()
      expect(User.create).toHaveBeenCalledWith(req.body)
      expect(User.create).toHaveBeenCalledTimes(1)
      expect(mockUser.password).toBe('hashpasswordtest')
      expect(mockUser.token).toBe('123456')
      expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
          name:req.body.name,
          email:req.body.email,
          token:'123456'
      })
      expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
      expect(mockUser.save).toHaveBeenCalled()
      expect(res.statusCode).toBe(201)
      expect(data).toEqual('User created succesfully')
    })
})


describe('AuthController.Login',()=>{
    it('Should return 403 user has not confirm their account',async()=>{

            const req = createRequest({
                method:'POST',
                url:"/api/auth/login",
                userExist: {
                    confirmed: false,
                  }
            })
    
            const res = createResponse();
            await AuthController.login(req,res)
            const data = res._getJSONData()
            expect(res.statusCode).toBe(403)
            expect(data).toHaveProperty('error','You have not confirm your account')
    })

    it('Should return 401 if password is incorrect',async()=>{

        // const userMock = 
        //     {
        //       id: 9,
        //       name: "isra2",
        //       email: "luna2@gmail.com",
        //       confirmed:true,
        //       password:'123456'
        //     }
        //   ;

        const req = createRequest({
            method:'POST',
            url:"/api/auth/login",
            userExist: {
                confirmed: true,
                password:'hashpasswordtest'
              },
            body:{
                email:'test@.com',
                password:'123456'
            }
        })

        const res = createResponse();

        ( checkPassword as jest.Mock).mockResolvedValue(false)
        await AuthController.login(req,res)
        const data = res._getJSONData()
        expect(checkPassword).toHaveBeenCalledWith(req.body.password,req.userExist.password)
        expect(res.statusCode).toBe(401)
        expect(data).toHaveProperty('error','Incorrect password')
       
})

it('Should return json web token if authentication is succeful',async()=>{

    const req = createRequest({
        method:'POST',
        url:"/api/auth/login",
        userExist: {
            id:1,
            confirmed: true,
            password:'hashpasswordtest'
          },
        body:{
            email:'test@.com',
            password:'123456'
        }
    })

    const res = createResponse();
    const fakeJWT = 'fake_jwt';

    ( checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue(fakeJWT);

    await AuthController.login(req,res)

    const data = res._getJSONData()

    expect(generateJWT).toHaveBeenCalledWith(req.userExist.id)
    expect(res.statusCode).toBe(200)
    expect(generateJWT).toHaveBeenCalledTimes(1)
    expect(data).toEqual(fakeJWT)
})
})