import { createRequest, createResponse } from "node-mocks-http";
import User from "../../../models/User";
import { validateExistToken, validateExistUser } from "../../../middleware/auth";

jest.mock('../../../models/User')

describe('Middleware Auth userExist',()=>{
    it('Should return 404 user is not found',async()=>{

        (User.findOne as jest.Mock).mockResolvedValue(null)

        const req = createRequest({
            method:'POST',
            url:"/api/auth/login",
            body:{
                email:'test@gmail.com',
            }
        })

        const res = createResponse();
        const next = jest.fn()

        await validateExistUser(req,res,next)
        const data = res._getJSONData()
        
        expect(res.statusCode).toBe(404)
        expect(data).toHaveProperty('error','User does not exist')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(next).not.toHaveBeenCalled()
    })

    it('Should return 500 when happen error',async()=>{

        (User.findOne as jest.Mock).mockRejectedValue(null)

        const req = createRequest({
            method:'POST',
            url:"/api/auth/login",
            body:{
                email:'test@gmail.com',
            }
        })

        const res = createResponse();
        const next = jest.fn()

        await validateExistUser(req,res,next)
        const data = res._getJSONData()
        
        expect(res.statusCode).toBe(500)
        expect(data).toHaveProperty('error','There is error')
        expect(next).not.toHaveBeenCalled()
    })

    it('Should execute next function and set user in the request',async()=>{
        const user = {
          id: 9,
          name: "isra2",
          email: "luna2@gmail.com",
        };
  
        (User.findOne as jest.Mock).mockResolvedValue(user)

        const req = createRequest({
            method:'POST',
            url:"/api/auth/login",
            body:{
                email:'test@gmail.com',
            }
        })

        const res = createResponse();
        const next = jest.fn()

        await validateExistUser(req,res,next)        
        
        expect(next).toHaveBeenCalled()
        expect(req.userExist).toEqual(user)
        expect(next).toHaveBeenCalledTimes(1)
    })
})

describe('Middleware Auth tokenExist',()=>{

    it('Should return code 404 and message token has not found',async()=>{

        (User.findOne as jest.Mock).mockResolvedValue(null)
    
        const req = createRequest({
            url:'middlware',
            body:{
                token:'123456'
            }
        });

        const res = createResponse();
        const next = jest.fn()

        await validateExistToken(req,res,next)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toHaveProperty('error','The token does not exist')
        expect(next).not.toHaveBeenCalled()

    })

    it('Should return code 404 and message token has not found',async()=>{

        (User.findOne as jest.Mock).mockRejectedValue(new Error)
    
        const req = createRequest({
            url:'middlware',
            body:{
                token:'123456'
            }
        });

        const res = createResponse();
        const next = jest.fn()

        await validateExistToken(req,res,next)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(500)
        expect(data).toHaveProperty('error','There is error')
        expect(next).not.toHaveBeenCalled()

    })

    it('Should return code 404 and message token has not found',async()=>{

        const user = {
            id: 9,
            name: "isra2",
            email: "luna2@gmail.com",
          };
    
          (User.findOne as jest.Mock).mockResolvedValue(user)
        const req = createRequest({
            url:'middlware',
            body:{
                token:'123456'
            }
        });

        const res = createResponse();
        const next = jest.fn()

        await validateExistToken(req,res,next)       
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalled()

        expect(req.userToken).toEqual(user)

    })
})
