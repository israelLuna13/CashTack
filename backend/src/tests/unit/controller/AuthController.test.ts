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

    it('Should return code 500 and error message by User.create',async()=>{

        const req = createRequest({
            method:'POST',
            url:"/api/auth/create-account",
            body:{
                email:'test@gmail.com',
                password:'123456',
                name:'test'
            }
        })

        const mockUser = {...req.body,save:jest.fn()};

        (User.create as jest.Mock).mockRejectedValue(new Error);

        const res = createResponse();


      await AuthController.createAccount(req,res)
      const data = res._getJSONData()

      expect(User.create).toHaveBeenCalled()
      expect(User.create).toHaveBeenCalledTimes(1)
      expect(mockUser.save).not.toHaveBeenCalled()
      expect(res.statusCode).toBe(500)
      expect(data).toHaveProperty('error','There is error')

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

describe('AuthController.checkToken',()=>{
    it('Should sent message correct token',()=>{

        const req= createRequest({
            method:'POST',
            url:'api/auth/check-token'
        })
        const res = createResponse()
        AuthController.checkToken(req,res)
        const data = res._getData()
        expect(res.statusCode).toBe(200)

        expect(data).toBe("correct token")
    })
    it('Should return code 500 and message error',()=>{
        const req= createRequest({
            method:'POST',
            url:'api/auth/check-token'
        })
        const res = createResponse()

        //make error to go catch
          // ⚠️ Sobrescribimos `res.send` para que lance un error
        res.send = () => {
        throw new Error("forced error");
        };
    
        AuthController.checkToken(req,res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(500)
        expect(data).toHaveProperty('error',"There is error")
    })
})

describe('AuthController.getUSer',()=>{
    it('Should return user',()=>{

        const user = {
            id: 9,
            name: "isra2",
            email: "luna2@gmail.com",
          };
    
        const req= createRequest({
            method:'GET',
            url:'/api/auth/user',
            userExist:user
        })
        const res = createResponse()
        AuthController.getUSer(req,res)

        const data = res._getData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe(user)
    })
})

describe('AuthController.confirmAccount',()=>{
    it('Should return code 200 and message',async()=>{

        const userMock = {
            confirmed:true,
            token:null
            ,
            save:jest.fn()
        }
        const req= createRequest({
            method:'POST',
            url:'/api/auth/confirm-account',
            userToken:userMock
        })
        const res = createResponse();
        (userMock.save as jest.Mock).mockResolvedValue(true)
        await AuthController.confirmAccount(req,res)

        const data = res._getData()
        expect(res.statusCode).toBe(200)
        expect(userMock.save).toHaveBeenCalled()
        expect(userMock.save).toHaveBeenCalledTimes(1)
        expect(data).toBe('User successfully confirmedy')
    })

    it('Should return code 500 and error message',async ()=>{

               

        const userMock = {
            confirmed:true,
            token:null
            ,
            save:jest.fn()
        };
        (userMock.save as jest.Mock).mockRejectedValue(new Error)

        const req= createRequest({
            method:'POST',
            url:'/api/auth/confirm-account',
            userToken:userMock
        })
        const res = createResponse();
         await AuthController.confirmAccount(req,res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(500)
        expect(data).toHaveProperty('error','There is error')
    })


})

describe('AuthController.forgotPassword',()=>{
    it('Should return code 200 and message',async()=>{

        const userMock = {
            name:'test',
            confirmed:true,
            token:'123456'
            ,
            save:jest.fn()
        }
        const tokenFake = 'fake_token'

        const req= createRequest({
            method:'POST',
            url:'/api/auth/forgot-password',
            userExist:userMock,
            body:{
                email:'test@gmail.com'
            }
        })
        const res = createResponse();

        (generateToken as jest.Mock).mockReturnValue(tokenFake);
        (userMock.save as jest.Mock).mockResolvedValue(true)

        jest.spyOn(AuthEmail,'sendTokenResetPassword').mockImplementation(()=> Promise.resolve());

        await AuthController.forgotPassword(req,res)

        const data = res._getData()
        expect(res.statusCode).toBe(200)
        expect(userMock.save).toHaveBeenCalled()
        expect(userMock.save).toHaveBeenCalledTimes(1)
        expect(req.userExist.token).toBe(tokenFake)
        expect(AuthEmail.sendTokenResetPassword).toHaveBeenCalledTimes(1)
        expect(AuthEmail.sendTokenResetPassword).toHaveBeenCalledWith({
            name:userMock.name,
            email:req.body.email,
            token:userMock.token
        })
        expect(data).toBe('Check your email and follow instructions')
    })


    it('Should return code 500 and error message',async()=>{

        const userMock = {
            name:'test',
            confirmed:true,
            token:'123456'
            ,
            save:jest.fn()
        }
        const tokenFake = 'fake_token'

        const req= createRequest({
            method:'POST',
            url:'/api/auth/forgot-password',
            userExist:userMock,
            body:{
                email:'test@gmail.com'
            }
        })
        const res = createResponse();

        (generateToken as jest.Mock).mockReturnValue(tokenFake);
        (userMock.save as jest.Mock).mockRejectedValue(new Error)

        jest.spyOn(AuthEmail,'sendTokenResetPassword').mockImplementation(()=> Promise.resolve());

        await AuthController.forgotPassword(req,res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(500)
        expect(userMock.save).toHaveBeenCalled()
        expect(userMock.save).toHaveBeenCalledTimes(1)
        expect(data).toHaveProperty('error','There is error')
    })

})

describe('AuthController.resetPasswordWithPassword',()=>{

    beforeEach(()=>{
        jest.resetAllMocks()
    })

    it('Should return status 200 and message',async()=>{
        const userMock = {
            name:'test',
            confirmed:true,
            token:'123456'
            ,
            save:jest.fn()
        };

        (User.findOne as jest.Mock).mockResolvedValue(userMock)

        const req = createRequest({
            method:'POST',
            url:'/api/auth/reset-password/:token',
            params:{token:'123456'},
            body:{
                password:'123456'
            }
        });
        const res = createResponse();
        (hashPassword as jest.Mock).mockResolvedValue(true);
        (userMock.save as jest.Mock).mockResolvedValue(true);
        await AuthController.resetPasswordWithPassword(req,res)

        const data = res._getData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe("The password has been updated")
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(hashPassword).toHaveBeenCalledWith(req.body.password)
        expect(userMock.save).toHaveBeenCalled()
        expect(userMock.save).toHaveBeenCalledTimes(1)
    })


    it('Should return status 404 and error message',async()=>{
        const userMock = {
            name:'test',
            confirmed:true,
            token:'123456'
            ,
            save:jest.fn()
        };

        (User.findOne as jest.Mock).mockResolvedValue(false)

        const req = createRequest({
            method:'POST',
            url:'/api/auth/reset-password/:token',
            params:{token:'123456'},
            body:{
                password:'123456'
            }
        });
        const res = createResponse();
       
        await AuthController.resetPasswordWithPassword(req,res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toHaveProperty("error","Incorrect token")
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(userMock.save).not.toHaveBeenCalled()
    })

    it("Should return status 500 and error message", async () => {
      const userMock = {
        name: "test",
        confirmed: true,
        token: "123456",
        save: jest.fn(),
      };

      (User.findOne as jest.Mock).mockResolvedValue(userMock);

      const req = createRequest({
        method: "POST",
        url: "/api/auth/reset-password/:token",
        params: { token: "123456" },
        body: {
          password: "123456",
        },
      });
      const res = createResponse();
      (hashPassword as jest.Mock).mockResolvedValue(true);
      (userMock.save as jest.Mock).mockRejectedValue(new Error());
      await AuthController.resetPasswordWithPassword(req, res);

      const data = res._getJSONData();
      expect(res.statusCode).toBe(500);
      expect(data).toHaveProperty("error", "There is error");
      expect(User.findOne).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(hashPassword).toHaveBeenCalledWith(req.body.password);
      expect(userMock.save).toHaveBeenCalled();
      expect(userMock.save).toHaveBeenCalledTimes(1);
    });
})

describe('AuthController.checkPassword',()=>{
    beforeEach(()=>{
        jest.resetAllMocks()
    })

   
    it('Should  return status 200 and message',async()=>{
        const userMock = {
            name:'test',
            confirmed:true,
            token:'123456',
            password:'123456'
        };
        (User.findByPk as jest.Mock).mockResolvedValue(userMock)

        const req = createRequest({
            method:'POST',
            url:'api/auth/check-password',
            body:{
                current_password:'123456'
            },
            userExist:{id:1}

        });
        const res = createResponse();
        ( checkPassword as jest.Mock).mockResolvedValue(true);
        await AuthController.checkPassword(req,res)

        const data = res._getData()

        expect(res.statusCode).toBe(200)
        expect(data).toBe('The password is correct')
        expect(User.findByPk).toHaveBeenCalled() 
        expect(User.findByPk).toHaveBeenCalledTimes(1) 
        expect(checkPassword).toHaveBeenCalledWith(req.body.current_password,userMock.password) 

    })

    it('Should  return status 401 and error message',async()=>{
        const userMock = {
            name:'test',
            confirmed:true,
            token:'123456',
            password:'123456'
        };
        (User.findByPk as jest.Mock).mockResolvedValue(userMock)

        const req = createRequest({
            method:'POST',
            url:'api/auth/check-password',
            body:{
                current_password:'123456'
            },
            userExist:{id:1}

        });
        const res = createResponse();
        ( checkPassword as jest.Mock).mockResolvedValue(false);
        await AuthController.checkPassword(req,res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(401)
        expect(data).toHaveProperty('error','Incorrect current password')
        expect(User.findByPk).toHaveBeenCalled() 
        expect(User.findByPk).toHaveBeenCalledTimes(1) 
        expect(checkPassword).toHaveBeenCalledWith(req.body.current_password,userMock.password) 
    })

    it('Should  return status 500 and error message by error on findByPk',async()=>{
      
        (User.findByPk as jest.Mock).mockRejectedValue(new Error)

        const req = createRequest({
            method:'POST',
            url:'api/auth/check-password',
            body:{
                current_password:'123456'
            },
            userExist:{id:1}

        });
        const res = createResponse();
        await AuthController.checkPassword(req,res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(500)
        expect(data).toHaveProperty('error','There is error')
        expect(User.findByPk).toHaveBeenCalled() 
        expect(User.findByPk).toHaveBeenCalledTimes(1) 
    })
})


describe('AuthController.updatePassword',()=>{
    beforeEach(()=>{
        jest.resetAllMocks()
    })
    it('Should return status 200 and message',async()=>{

  const userMock = {
            name:'test',
            confirmed:true,
            token:'123456',
            password:'123456',
            save:jest.fn()
        };
        (User.findByPk as jest.Mock).mockResolvedValue(userMock)

        const req = createRequest({
            method:'POST',
            url:'api/auth/update-password',
            body:{
                current_password:'123456',
                new_password:'123456'
            },
            userExist:{id:1}

        });
        const res = createResponse();
        ( checkPassword as jest.Mock).mockResolvedValue(true);
        (hashPassword as jest.Mock).mockResolvedValue(req.body.new_password);
        (userMock.save as jest.Mock).mockResolvedValue(true)
        await AuthController.updatePassword(req,res);

        const data = res._getData()

        expect(res.statusCode).toBe(200)
        expect(data).toBe('The password has been updated')
        expect(userMock.save).toHaveBeenCalled() 
        expect(userMock.save).toHaveBeenCalledTimes(1) 
        expect(User.findByPk).toHaveBeenCalled() 
        expect(User.findByPk).toHaveBeenCalledTimes(1) 
        expect(checkPassword).toHaveBeenCalledWith(req.body.current_password,userMock.password) 
        expect(userMock.password).toEqual(req.body.new_password)

    })



    it('Should return status 404 and message incorrect password',async()=>{

        const userMock = {
                  name:'test',
                  confirmed:true,
                  token:'123456',
                  password:'123456',
                  save:jest.fn()
              };
              (User.findByPk as jest.Mock).mockResolvedValue(userMock)
      
              const req = createRequest({
                  method:'POST',
                  url:'api/auth/update-password',
                  body:{
                      current_password:'123456',
                      new_password:'123456'
                  },
                  userExist:{id:1}
      
              });
              const res = createResponse();
              ( checkPassword as jest.Mock).mockResolvedValue(false);
              
              await AuthController.updatePassword(req,res);
      
              const data = res._getJSONData()
      
              expect(res.statusCode).toBe(401)
              expect(data).toHaveProperty('error','Incorrect current password')
              expect(userMock.save).not.toHaveBeenCalled() 
              expect(User.findByPk).toHaveBeenCalled() 
              expect(User.findByPk).toHaveBeenCalledTimes(1) 
              expect(checkPassword).toHaveBeenCalledWith(req.body.current_password,userMock.password) 
      
          })

          it("Should return status 500 and error message by error on findByPk", async () => {
            const userMock = {
              name: "test",
              confirmed: true,
              token: "123456",
              password: "123456",
              save: jest.fn(),
            };
            (User.findByPk as jest.Mock).mockRejectedValue(new Error());

            const req = createRequest({
              method: "POST",
              url: "api/auth/update-password",
              body: {
                current_password: "123456",
                new_password: "123456",
              },
              userExist: { id: 1 },
            });
            const res = createResponse();

            await AuthController.updatePassword(req, res);

            const data = res._getJSONData();

            expect(res.statusCode).toBe(500);
            expect(data).toHaveProperty("error", "There is error");
            expect(userMock.save).not.toHaveBeenCalled();
            expect(User.findByPk).toHaveBeenCalled();
            expect(User.findByPk).toHaveBeenCalledTimes(1);
          });
})